import { ObjectId } from 'mongodb';

import Post from '~/models/post.model';
import User from '~/models/user.model';
import cloudinary from '~/config/cloudinary';
import { BadRequestError, ForbiddenError, NotFoundError } from '~/core/error.response';
import Notification from '~/models/notification.model';
import { ENotification } from '~/constants/enum';
import { SuccessResponse } from '~/core/success.response';
import Comment from '~/models/comment.model';

class PostService {
  getPosts = async () => {
    const posts = Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username firstName lastName profilePicture'
        }
      })
      .lean();

    return posts;
  };

  getPostById = async (postId: string) => {
    const post = await Post.findById(postId)
      .populate('user', 'username firstName lastName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username firstName lastName profilePicture'
        }
      })
      .lean();

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    return post;
  };

  getPostsByUsername = async (username: string) => {
    const user = await User.findOne({
      username: username
    }).lean();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username firstName lastName profilePicture'
        }
      })
      .lean();

    return posts;
  };

  createPost = async ({
    userId,
    content,
    image
  }: {
    userId: string;
    content?: string;
    image?: Express.Multer.File;
  }) => {
    if (!content && !image) {
      throw new BadRequestError('Content or image is required to create a post');
    }

    const user = await User.findOne({
      clerkId: userId
    }).lean();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    let imageUrl = '';

    if (image) {
      try {
        const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          folder: 'social_media_posts',
          resource_type: 'image',
          transformation: [
            {
              width: 800,
              height: 600,
              crop: 'limit'
            },
            {
              quality: 'auto'
            },
            {
              format: 'auto'
            }
          ]
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.log('🚀 ~ PostService ~ error:', error);
        throw new BadRequestError('Failed to upload image');
      }
    }

    const post = await Post.create({
      user: user._id,
      content: content || '',
      image: imageUrl
    });

    return post.toObject();
  };

  likePost = async (postId: string, userId: string) => {
    const user = await User.findOne({ clerkId: userId }).lean();
    const post = await Post.findById(new ObjectId(postId));

    if (!user || !post) {
      throw new NotFoundError('User or post not found');
    }

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      // unlike
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: user._id }
      });
    } else {
      // like
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: user._id }
      });

      // create notification
      if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
          from: user._id,
          to: post.user,
          type: ENotification.LIKE,
          post: post._id
        });
      }
    }

    return new SuccessResponse({
      message: `${isLiked ? 'Unliked' : 'Liked'} post successfully`,
      metadata: {
        isLiked: !isLiked
      }
    });
  };

  deletePost = async (postId: string, userId: string) => {
    const user = await User.findOne({ clerkId: userId }).lean();
    const post = await Post.findById(new ObjectId(postId));

    if (!user || !post) {
      throw new NotFoundError('User or post not found');
    }

    if (post.user.toString() !== user._id.toString()) {
      throw new ForbiddenError('You are not allowed to delete this post');
    }

    // delete all comment on this post
    await Comment.deleteMany({ post: new ObjectId(postId) });

    // delete all notifications related to this post
    await Notification.deleteMany({ post: new ObjectId(postId) });

    // delete the post
    await Post.findByIdAndDelete(new ObjectId(postId));

    return {};
  };
}

const postService = new PostService();

export default postService;

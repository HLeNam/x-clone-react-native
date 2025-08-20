import { ObjectId } from 'mongodb';
import { ENotification } from '../constants/enum';
import { BadRequestError, ForbiddenError, NotFoundError } from '../core/error.response';

import Comment from '../models/comment.model';
import Notification from '../models/notification.model';
import Post from '../models/post.model';
import User from '../models/user.model';

class CommentService {
  getCommentsByPostId = async (postId: string) => {
    const comments = await Comment.find({
      post: new ObjectId(postId)
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName profilePicture')
      .lean();

    return {
      comments
    };
  };

  createComment = async ({
    userId,
    postId,
    content
  }: {
    userId: string;
    postId: string | undefined;
    content: string | undefined;
  }) => {
    if (!content || !content.trim()) {
      throw new BadRequestError('Content is required');
    }

    const user = await User.findOne({
      clerkId: userId
    }).lean();

    const post = await Post.findById(new ObjectId(postId)).lean();

    if (!user || !post) {
      throw new NotFoundError('User or Post not found');
    }

    const comment = await Comment.create({
      user: user._id,
      post: post._id,
      content: content
    });

    // link the comment to the post
    await Post.findByIdAndUpdate(post._id, {
      $push: {
        comments: comment._id
      }
    });

    // create notification if not commenting on own post
    if (post.user.toString() !== user._id.toString()) {
      await Notification.create({
        from: user._id,
        to: post.user,
        type: ENotification.COMMENT,
        post: post._id,
        comment: comment._id
      });
    }

    return {
      comment: comment.toObject()
    };
  };

  deleteComment = async (userId: string, commentId: string) => {
    const user = await User.findOne({ clerkId: userId }).lean();
    const comment = await Comment.findById(new ObjectId(commentId)).lean();

    if (!user || !comment) {
      throw new NotFoundError('User or Comment not found');
    }

    if (comment.user.toString() !== user._id.toString()) {
      throw new ForbiddenError('You do not have permission to delete this comment');
    }

    // remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: {
        comments: comment._id
      }
    });

    // delete notification
    await Notification.deleteMany({
      comment: comment._id
    });

    // delete the comment
    await Comment.findByIdAndDelete(comment._id);

    return {};
  };
}

const commentService = new CommentService();

export default commentService;

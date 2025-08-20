import User, { UserType } from '../models/user.model';
import { ConflictRequestError, NotFoundError } from '../core/error.response';
import { clerkClient } from '@clerk/express';
import { Created, SuccessResponse } from '../core/success.response';
import { ObjectId } from 'mongodb';
import Notification from '../models/notification.model';
import { ENotification } from '../constants/enum';

class UserService {
  getUserProfile = async (username: string) => {
    const user = await User.findOne({
      username: username
    }).lean();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  };

  updateUserProfile = async (userId: string, data: Partial<UserType>) => {
    const user = await User.findOneAndUpdate(
      {
        clerkId: userId
      },
      data,
      { new: true }
    ).lean();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  };

  syncUser = async (userId: string) => {
    const existingUser = await User.findOne({ clerkId: userId }).lean();

    if (existingUser) {
      return new SuccessResponse({
        message: 'User already exists in the database',
        metadata: {
          user: existingUser
        }
      });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const user: Partial<UserType> = {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      username: clerkUser.username || clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')?.[0] || '',
      profilePicture: clerkUser.imageUrl || ''
    };

    const newUser = await User.create(user);

    return new Created({
      message: 'User created successfully',
      metadata: {
        user: newUser
      }
    });
  };

  getCurrentUser = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  };

  followUser = async (userId: string, targetUserId: string) => {
    if (userId === targetUserId) {
      throw new ConflictRequestError('You cannot follow yourself');
    }

    const currentUser = await User.findOne({ clerkId: userId }).lean();
    const targetUser = await User.findById(new ObjectId(targetUserId)).lean();

    if (!currentUser || !targetUser) {
      throw new NotFoundError('User not found');
    }

    const isFollowing = currentUser.following?.find((id) => id.toString() === targetUserId);

    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: {
          following: new ObjectId(targetUserId)
        }
      });

      await User.findByIdAndUpdate(targetUser._id, {
        $pull: {
          followers: currentUser._id
        }
      });
    } else {
      // follow
      await User.findByIdAndUpdate(currentUser._id, {
        $push: {
          following: new ObjectId(targetUserId)
        }
      });

      await User.findByIdAndUpdate(targetUser._id, {
        $push: {
          followers: currentUser._id
        }
      });

      // create notification
      await Notification.create({
        from: currentUser._id,
        to: new ObjectId(targetUserId),
        type: ENotification.FOLLOW
      });
    }

    return new SuccessResponse({
      message: `${isFollowing ? 'Unfollowed' : 'Followed'} user successfully`,
      metadata: {
        following: !isFollowing
      }
    });
  };
}

const userService = new UserService();

export default userService;

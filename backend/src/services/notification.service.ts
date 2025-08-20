import { ObjectId } from 'mongodb';

import User from '../models/user.model';
import { NotFoundError } from '../core/error.response';
import Notification from '../models/notification.model';

class NotificationService {
  getNotifications = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId }).lean();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const notifications = await Notification.find({
      to: user._id
    })
      .sort({ createdAt: -1 })
      .populate('from', 'username firstName lastName profilePicture')
      .populate('post', 'content image')
      .populate('comment', 'content')
      .lean();

    return {
      notifications: notifications
    };
  };

  deleteNotification = async (userId: string, notificationId: string) => {
    const user = await User.findOne({ clerkId: userId }).lean();
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const notification = await Notification.findOneAndDelete({
      _id: new ObjectId(notificationId),
      to: user._id
    }).lean();

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    return {
      notification
    };
  };
}

const notificationService = new NotificationService();

export default notificationService;

import { NextFunction, Request, Response } from 'express';

import { SuccessResponse } from '../core/success.response';
import notificationService from '../services/notification.service';

class NotificationController {
  getNotifications = async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.userId!;

    new SuccessResponse({
      message: 'Notifications retrieved successfully',
      metadata: await notificationService.getNotifications(userId)
    }).send(res);
  };

  deleteNotification = async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.userId!;
    const notificationId = req.params.notificationId;

    new SuccessResponse({
      message: 'Notification deleted successfully',
      metadata: await notificationService.deleteNotification(userId, notificationId)
    }).send(res);
  };
}

const notificationController = new NotificationController();

export default notificationController;

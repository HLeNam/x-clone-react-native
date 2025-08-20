import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import { protectRoute } from '../middlewares/auth.middleware';
import notificationController from '../controllers/notification.controller';

const notificationRouter = express.Router();

notificationRouter.get('/', protectRoute, expressAsyncHandler(notificationController.getNotifications));
notificationRouter.delete(
  '/:notificationId',
  protectRoute,
  expressAsyncHandler(notificationController.deleteNotification)
);

export default notificationRouter;

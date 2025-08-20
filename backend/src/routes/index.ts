import express from 'express';
import { clerkMiddleware } from '@clerk/express';

import userRoutes from '~/routes/user.route';
import postRoutes from '~/routes/post.route';
import commentRoutes from '~/routes/comment.route';
import notificationRoutes from '~/routes/notification.route';
import { arcjetMiddleware } from '~/middlewares/arcjet.middleware';

const router = express.Router();

router.use(clerkMiddleware());

router.use(arcjetMiddleware);

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);

export default router;

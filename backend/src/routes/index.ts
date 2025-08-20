import express from 'express';
import { clerkMiddleware } from '@clerk/express';

import userRoutes from '~/routes/user.route';
import postRoutes from '~/routes/post.route';
import commentRoutes from '~/routes/comment.route';

const router = express.Router();

router.use(clerkMiddleware());

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

export default router;

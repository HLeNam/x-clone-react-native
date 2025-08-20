import express from 'express';
import { clerkMiddleware } from '@clerk/express';

import userRoutes from '~/routes/user.route';
import postRoutes from '~/routes/post.route';

const router = express.Router();

router.use(clerkMiddleware());

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;

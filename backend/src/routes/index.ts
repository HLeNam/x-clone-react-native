import express from 'express';
import { clerkMiddleware } from '@clerk/express';

import userRoutes from '~/routes/user.route';

const router = express.Router();

router.use(clerkMiddleware());

router.use('/users', userRoutes);

export default router;

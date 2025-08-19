import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import { protectRoute } from '~/middlewares/auth.middleware';
import userController from '~/controllers/user.controller';

const router = express.Router();

router.get('/profile/:username', expressAsyncHandler(userController.getUserProfile));

router.post('/sync', protectRoute, expressAsyncHandler(userController.syncUser));
router.post('/me', protectRoute, expressAsyncHandler(userController.getCurrentUser));
router.put('/profile', protectRoute, expressAsyncHandler(userController.updateUserProfile));
router.post('/follow/:targetUserId', protectRoute, expressAsyncHandler(userController.followUser));

export default router;

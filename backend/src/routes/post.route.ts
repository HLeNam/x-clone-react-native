import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import postController from '../controllers/post.controller';
import { protectRoute } from '../middlewares/auth.middleware';
import { uploadConfigs, uploadMiddleware } from '../middlewares/upload.middleware';

const postRouter = express.Router();

postRouter.get('/', expressAsyncHandler(postController.getPosts));
postRouter.get('/:postId', expressAsyncHandler(postController.getPostById));
postRouter.get('/user/:username', expressAsyncHandler(postController.getPostsByUsername));

postRouter.post(
  '/',
  protectRoute,
  uploadMiddleware.memory(uploadConfigs.image),
  expressAsyncHandler(postController.createPost)
);
postRouter.post('/:postId/like', protectRoute, expressAsyncHandler(postController.likePost));
postRouter.delete('/:postId', protectRoute, expressAsyncHandler(postController.deletePost));

export default postRouter;

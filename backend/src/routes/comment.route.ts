import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import { protectRoute } from '../middlewares/auth.middleware';
import commentController from '../controllers/comment.controller';

const commentRouter = express.Router();

commentRouter.get('/post/:postId', expressAsyncHandler(commentController.getCommentsByPostId));

commentRouter.post('/post/:postId', protectRoute, expressAsyncHandler(commentController.createComment));
commentRouter.delete('/:commentId', protectRoute, expressAsyncHandler(commentController.deleteComment));

export default commentRouter;

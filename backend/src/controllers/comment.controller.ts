import { NextFunction, Request, Response } from 'express';

import commentService from '../services/comment.service';
import { SuccessResponse } from '../core/success.response';

class CommentController {
  getCommentsByPostId = async (req: Request, res: Response, _next: NextFunction) => {
    const postId = req.params.postId;

    new SuccessResponse({
      message: 'Comments retrieved successfully',
      metadata: await commentService.getCommentsByPostId(postId)
    }).send(res);
  };

  createComment = async (
    req: Request<{ postId: string }, unknown, { content: string }>,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.userId!;
    const postId = req.params.postId;
    const content = req.body.content;

    new SuccessResponse({
      message: 'Comment created successfully',
      metadata: await commentService.createComment({
        userId,
        postId,
        content
      })
    }).send(res);
  };

  deleteComment = async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.userId!;
    const commentId = req.params.commentId;

    new SuccessResponse({
      message: 'Comment deleted successfully',
      metadata: await commentService.deleteComment(userId, commentId)
    }).send(res);
  };
}

const commentController = new CommentController();

export default commentController;

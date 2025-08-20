import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import postService from '../services/post.service';
import { Created, SuccessResponse } from '../core/success.response';

class PostController {
  getPosts = async (_req: Request, res: Response, _next: NextFunction) => {
    new SuccessResponse({
      message: 'Get posts successfully',
      metadata: {
        posts: await postService.getPosts()
      }
    }).send(res);
  };

  getPostById = async (req: Request, res: Response, _next: NextFunction) => {
    const { postId } = req.params;

    new SuccessResponse({
      message: 'Get post by ID successfully',
      metadata: {
        post: await postService.getPostById(postId)
      }
    }).send(res);
  };

  getPostsByUsername = async (req: Request, res: Response, _next: NextFunction) => {
    const { username } = req.params;

    new SuccessResponse({
      message: 'Get posts by username successfully',
      metadata: {
        posts: await postService.getPostsByUsername(username)
      }
    }).send(res);
  };

  createPost = async (
    req: Request<ParamsDictionary, unknown, { content?: string }>,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.userId!;
    const content = req.body.content || '';
    const imageFile = req.file;

    new Created({
      message: 'Post created successfully',
      metadata: await postService.createPost({
        userId,
        content,
        image: imageFile
      })
    }).send(res);
  };

  likePost = async (req: Request<{ postId: string }>, res: Response, _next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.userId!;

    (await postService.likePost(postId, userId)).send(res);
  };

  deletePost = async (req: Request<{ postId: string }>, res: Response, _next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.userId!;

    new SuccessResponse({
      message: 'Post deleted successfully',
      metadata: await postService.deletePost(postId, userId)
    }).send(res);
  };
}

const postController = new PostController();

export default postController;

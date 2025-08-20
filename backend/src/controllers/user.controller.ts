import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { UserType } from '../models/user.model';
import userService from '../services/user.service';
import { SuccessResponse } from '../core/success.response';

class UserController {
  getUserProfile = async (req: Request<{ username: string }>, res: Response, _next: NextFunction) => {
    new SuccessResponse({
      message: 'User profile retrieved successfully',
      metadata: await userService.getUserProfile(req.params.username)
    }).send(res);
  };

  updateUserProfile = async (
    req: Request<ParamsDictionary, unknown, Partial<UserType>>,
    res: Response,
    _next: NextFunction
  ) => {
    const userId = req.userId!;
    const data = req.body;

    new SuccessResponse({
      message: 'User profile updated successfully',
      metadata: await userService.updateUserProfile(userId, data)
    }).send(res);
  };

  syncUser = async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.userId!;

    (await userService.syncUser(userId)).send(res);
  };

  getCurrentUser = async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.userId!;

    new SuccessResponse({
      message: 'Current user retrieved successfully',
      metadata: await userService.getCurrentUser(userId)
    }).send(res);
  };

  followUser = async (req: Request<{ targetUserId: string }>, res: Response, _next: NextFunction) => {
    const userId = req.userId!;
    const { targetUserId } = req.params;

    (await userService.followUser(userId, targetUserId)).send(res);
  };
}

const userController = new UserController();

export default userController;

import { getAuth } from '@clerk/express';
import { NextFunction, Request, Response } from 'express';
import { AuthFailureError } from '../core/error.response';

export const protectRoute = (req: Request, _res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AuthFailureError('Unauthorized - you must be logged in');
  }

  req.userId = userId;

  next();
};

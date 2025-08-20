import { NextFunction, Request, Response } from 'express';

import { aj } from '~/config/arcjet';
import { ForbiddenError, TooManyRequestsError } from '~/core/error.response';

export const arcjetMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1 // each request consumes 1 token
    });

    // handle denied request
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new TooManyRequestsError('Rate limit exceeded. Please try again later.');
      } else if (decision.reason.isBot()) {
        throw new ForbiddenError('Automated requests are not allowed.');
      } else {
        throw new ForbiddenError('Access denied by security policies.');
      }
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      throw new ForbiddenError('Malicious bot activity detected.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

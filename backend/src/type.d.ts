import * as _express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// https://www.ceamkrier.com/post/extend-express-request-object-type/

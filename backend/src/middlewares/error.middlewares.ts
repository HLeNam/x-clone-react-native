import { Request, Response, NextFunction } from 'express';
import httpStatusCode from '~/constants/httpStatusCode';
// import _ from 'lodash';
// import httpStatus from '~/constants/httpStatus';
// import { EntityError, ErrorWithStatus } from '~/models/Errors';

interface BaseError extends Error {
  status?: number;
  httpCode?: number;
  statusCode?: number;
  errors?: Record<string, { msg: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

interface ErrorResponse {
  message: string;
  [key: string]: unknown;
}

export const defaultErrorHandler = (err: BaseError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error occurred:', err);

  let status = +httpStatusCode.StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'An unexpected error occurred';

  const excludedProps = [
    'name',
    'stack',
    'status',
    'httpCode',
    'statusCode',
    'code',
    'path',
    'expose',
    'syscall',
    'errno'
  ];

  // if (err instanceof EntityError || err instanceof ErrorWithStatus) {
  //   status = err.status;
  //   message = err.message;
  // } else {
  status = err.status || err.httpCode || err.statusCode || +httpStatusCode.StatusCodes.INTERNAL_SERVER_ERROR;
  message = err.message || 'An unexpected error occurred';
  // }

  const responseData: ErrorResponse = {
    message,
    //  ..._.omit(err, excludedProps)
    ...Object.fromEntries(Object.entries(err).filter(([key]) => !excludedProps.includes(key)))
  };

  res.status(status).json(responseData);
};

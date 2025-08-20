import StatusCodes from '~/constants/statusCodes';
import ReasonPhrase from '~/constants/reasonPhrases';

const STATUS_CODE = {
  FORBIDDEN: 403,
  CONFLICT: 409
};

const REASON_STATUS_CODE = {
  FORBIDDEN: 'Bad Request Error',
  CONFLICT: 'Conflict Error'
};

class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = REASON_STATUS_CODE.CONFLICT, statusCode = STATUS_CODE.CONFLICT) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = REASON_STATUS_CODE.FORBIDDEN, statusCode = STATUS_CODE.FORBIDDEN) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonPhrase.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrase.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrase.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}

class RedisErrorResponse extends ErrorResponse {
  constructor(message = ReasonPhrase.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

class TooManyRequestsError extends ErrorResponse {
  constructor(message = ReasonPhrase.TOO_MANY_REQUESTS, statusCode = StatusCodes.TOO_MANY_REQUESTS) {
    super(message, statusCode);
  }
}

export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  ErrorResponse,
  RedisErrorResponse,
  TooManyRequestsError
};

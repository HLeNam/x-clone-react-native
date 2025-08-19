import { Response } from 'express';

const STATUS_CODE = {
  OK: 200,
  CREATED: 201
};

const REASON_STATUS_CODE = {
  OK: 'Success',
  CREATED: 'Created'
};

class SuccessResponse {
  message: string;
  status: number;
  metadata: Record<string, unknown>;

  constructor({
    message,
    statusCode = STATUS_CODE.OK,
    reasonStatusCode = REASON_STATUS_CODE.OK,
    metadata = {}
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: Record<string, unknown>;
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, _headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }: { message: string; metadata?: Record<string, unknown> }) {
    super({ message, metadata });
  }
}

class Created extends SuccessResponse {
  options: Record<string, unknown>;

  constructor({
    message,
    statusCode = STATUS_CODE.CREATED,
    reasonStatusCode = REASON_STATUS_CODE.CREATED,
    metadata,
    options = {}
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: Record<string, unknown>;
    options?: Record<string, unknown>;
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata
    });

    this.options = options;
  }
}

export { SuccessResponse, OK, Created };

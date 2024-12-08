import statusCodes from './statusCodes';

export class BadRequestError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.BAD_REQUEST;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.NOT_FOUND;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

export class UnAuthenticatedError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.UNAUTHORIZED;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

export class UnAuthorizedError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  msg: string;
  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.FORBIDDEN;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.msg = message;
  }
}

export class ConflictError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCodes.CONFLICT;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

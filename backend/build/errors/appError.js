"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.UnAuthorizedError = exports.UnAuthenticatedError = exports.NotFoundError = exports.BadRequestError = void 0;
const statusCodes_1 = __importDefault(require("./statusCodes"));
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes_1.default.BAD_REQUEST;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.msg = message;
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes_1.default.NOT_FOUND;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.msg = message;
    }
}
exports.NotFoundError = NotFoundError;
class UnAuthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes_1.default.UNAUTHORIZED;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.msg = message;
    }
}
exports.UnAuthenticatedError = UnAuthenticatedError;
class UnAuthorizedError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes_1.default.FORBIDDEN;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.msg = message;
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = statusCodes_1.default.CONFLICT;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
}
exports.ConflictError = ConflictError;

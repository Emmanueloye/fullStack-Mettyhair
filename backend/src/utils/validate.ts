import { body, validationResult, param } from 'express-validator';
import * as AppError from '../errors/appError';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

export const checkForErrors = (validatedInputs: any, errType = 400) => {
  return [
    validatedInputs,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (errType === 400) {
          const errMsg = errors
            .array()
            .map((val) => val.msg)
            .join(',');
          throw new AppError.BadRequestError(errMsg);
        }
        if (errType === 401) {
          const errMsg = errors
            .array()
            .map((val) => val.msg)
            .join(',');
          throw new AppError.UnAuthenticatedError(errMsg);
        }
      }
      next();
    },
  ];
};

export const validateParams = checkForErrors([
  param('id')
    .custom((value) => Types.ObjectId.isValid(value))
    .withMessage('No page found for the requested id'),
]);

import statusCodes from '../errors/statusCodes';
import * as AppError from '../errors/appError';
import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';

const sendError = (res: Response, err: any) => {
  if (err.isOperational) {
    res
      .status(err.statusCode)
      .json({ status: 'fail', message: err.msg, statusCode: err.statusCode });
  } else {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};
// Handles mongoose validation errors
const handleValidationErrors = (err: any) => {
  const msg = Object.values(err.errors)
    .map((val: any) => val.message)
    .join(',');
  return new AppError.BadRequestError(msg);
};

// Handles mongoose duplicate errors
const handleDuplicateError = (err: any) => {
  const value = Object.keys(err.keyValue)[0];
  const newVal = value.charAt(0).toUpperCase() + value.slice(1);
  return new AppError.BadRequestError(
    `${newVal} already in use. Please choose another value.`
  );
};

const globalErrorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  if (err.name === 'ValidationError') error = handleValidationErrors(err);

  if (err.code === 11000) error = handleDuplicateError(err);

  if (req.body.productImage) {
    await cloudinary.uploader.destroy(req.body.productImagePublicId);
  }

  if (req.body.thumbnails) {
    req.body.thumbnailsPublicId.forEach(async (publicId: string) => {
      await cloudinary.uploader.destroy(publicId);
    });
  }

  // sendError(res, error);
  res
    .status(err.statusCode || statusCodes.INTERNAL_SERVER_ERROR)
    .json({ status: error.status, err, stack: err.stack });
};

export default globalErrorMiddleware;

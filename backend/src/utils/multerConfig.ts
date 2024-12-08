import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import * as AppError from '../errors/appError';

export const multerStorage = multer.memoryStorage();

export const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError.BadRequestError('photo field accepts only image.'));
  }
};

export default multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

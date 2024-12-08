import { NextFunction, Request, Response } from 'express';
import * as factory from '../../utils/handlerFactory';
import Category from './categoryModel';
import * as utils from '../../utils';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

// To upload user image using multer.
export const uploadPhoto = utils.upload.single('photo');

export const createCategory = factory.createOne({
  Model: Category,
  label: 'category',
  includedFields: ['category', 'photo', 'createdAt', 'createdBy'],
});

export const getCategories = factory.getAll({
  Model: Category,
  label: 'categories',
});

export const getCategory = factory.getOne({
  Model: Category,
  label: 'category',
});

export const updateCategory = factory.updateOne({
  Model: Category,
  label: 'category',
});

export const deleteCategory = factory.deleteOne({
  Model: Category,
  label: 'category',
});

export const setSlug = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.category && !req.body.slug)
    req.body.slug = utils.slugifyInput(req.body.category);

  next();
};

// Process category image
export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentCategory = await Category.findById(req.params.id);
  // If user does not update image, move on to the next middleware.
  if (!req.file) return next();

  //   Put the file path on the body
  const fileName = `${req.file.originalname.split('.').at(0)}.png`;

  await sharp(req.file!.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toFile(`public/upload/${fileName}`);

  if (currentCategory?.photoPublicId) {
    await cloudinary.uploader.destroy(currentCategory.photoPublicId);
  }

  const resp = await cloudinary.uploader.upload(`public/upload/${fileName}`);
  await fs.unlink(`public/upload/${fileName}`);
  req.body.photo = resp.secure_url;
  req.body.photoPublicId = resp.public_id;

  next();
};

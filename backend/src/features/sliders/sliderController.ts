import { NextFunction, Request, Response } from 'express';
import Slider from './sliderModel';
import * as factory from '../../utils/handlerFactory';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import * as utils from '../../utils';
import * as AppError from '../../errors/appError';
import statusCodes from '../../errors/statusCodes';

export const createSlider = factory.createOne({
  Model: Slider,
  label: 'slider',
  includedFields: ['title', 'description', 'image', 'createdAt', 'createdBy'],
});

export const getSliders = factory.getAll({ Model: Slider, label: 'sliders' });

export const getSlider = factory.getOne({ Model: Slider, label: 'slider' });

export const updateSlider = factory.updateOne({
  Model: Slider,
  label: 'slider',
});

export const deleteSlider = async (req: Request, res: Response) => {
  const slider = await Slider.findById(req.params.id);
  if (!slider) {
    throw new AppError.NotFoundError(
      'We could not find the slider you want to delete.'
    );
  }
  if (slider.imagePublicId) {
    await cloudinary.uploader.destroy(slider.imagePublicId);
  }
  await slider.deleteOne();

  res.status(statusCodes.NO_CONTENT).json({ status: 'success' });
};

// set created at and created by on req.body
export const setCreationData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.createdBy) req.body.createdBy = req.user?.id;
  next();
};

// set updated at and updated by on req.body
export const setUpdateData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.updatedAt) req.body.updatedAt = Date.now();
  if (!req.body.updatedBy) req.body.updatedBy = req.user?.id;
  next();
};

// To upload slider image
export const uploadSlider = utils.upload.single('image');

// slider image processing.
export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentSlider = await Slider.findById(req.params.id);

  if (!req.file) return next();

  const fileName = `${req.file.originalname.split('.').at(0)}.png`;

  await sharp(req.file!.buffer)
    .resize(500, 500)
    .toFormat('png')
    .toFile(`public/upload/${fileName}`);

  if (currentSlider?.imagePublicId) {
    await cloudinary.uploader.destroy(currentSlider.imagePublicId);
  }

  const resp = await cloudinary.uploader.upload(`public/upload/${fileName}`);
  await fs.unlink(`public/upload/${fileName}`);
  req.body.image = resp.secure_url;
  req.body.imagePublicId = resp.public_id;

  next();
};

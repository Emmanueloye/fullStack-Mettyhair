import { NextFunction, Request, Response } from 'express';
import * as utils from '../../utils';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import Product from './productModel';

type ImageTypes = {
  image: any;
  width: number;
  height: number;
  format: 'jpeg' | 'png';
};
const processImage = async ({ image, width, height, format }: ImageTypes) => {
  // Create the filename
  const filename = `public/upload/${utils
    .generateToken({ type: 'plain' })
    .slice(0, 10)}.${format}`;

  // Process the image the file
  await sharp(image).resize(width, height).toFormat(format).toFile(filename);

  return filename;
};

export const processProductImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if there is product image on files
  if ((req.files as any)?.productImage?.at(0)) {
    const filename = await processImage({
      image: (req.files as any).productImage[0].buffer,
      width: 800,
      height: 800,
      format: 'png',
    });

    // Save to cloudinary
    const resp = await cloudinary.uploader.upload(filename);
    // Delete the file from file system
    await fs.unlink(filename);

    // Put the returned image link on request body.
    req.body.productImage = resp.secure_url;
    req.body.productImagePublicId = resp.public_id;
  }

  if ((req.files as any)?.thumbnails?.at(0)) {
    req.body.thumbnails = [];
    req.body.thumbnailsPublicId = [];

    for (const image of (req.files as any).thumbnails) {
      const filename = await processImage({
        image: image.buffer,
        width: 800,
        height: 800,
        format: 'png',
      });

      const resp = await cloudinary.uploader.upload(filename);
      // Delete the file from file system
      await fs.unlink(filename);

      req.body.thumbnails.push(resp.secure_url);
      req.body.thumbnailsPublicId.push(resp.public_id);
    }
  }
  next();
};

export const updateProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await Product.findById(req.params.id);
  // Check if there is product image on files
  if ((req.files as any)?.productImage?.at(0)) {
    const filename = await processImage({
      image: (req.files as any).productImage.at(0).buffer,
      width: 800,
      height: 800,
      format: 'png',
    });

    if (product?.productImagePublicId) {
      await cloudinary.uploader.destroy(product.productImagePublicId);
    }
    const resp = await cloudinary.uploader.upload(filename);
    await fs.unlink(filename);
    req.body.productImage = resp.secure_url;
    req.body.productImagePublicId = resp.public_id;
  }

  req.body.thumbnails = product && [...product.thumbnails];
  req.body.thumbnailsPublicId = product && [...product.thumbnailsPublicId];

  if ((req.files as any)?.thumbOne?.at(0)) {
    const filename = await processImage({
      image: (req.files as any).thumbOne.at(0).buffer,
      width: 800,
      height: 800,
      format: 'png',
    });

    if (product?.thumbnailsPublicId) {
      await cloudinary.uploader.destroy(product.thumbnailsPublicId[0]);
    }
    const resp = await cloudinary.uploader.upload(filename);
    await fs.unlink(filename);
    req.body.thumbnails[0] = resp.secure_url;
    req.body.thumbnailsPublicId[0] = resp.public_id;
  }

  if ((req.files as any)?.thumbTwo?.at(0)) {
    const filename = await processImage({
      image: (req.files as any).thumbTwo.at(0).buffer,
      width: 800,
      height: 800,
      format: 'png',
    });

    if (product?.thumbnailsPublicId) {
      await cloudinary.uploader.destroy(product.thumbnailsPublicId[1]);
    }
    const resp = await cloudinary.uploader.upload(filename);
    await fs.unlink(filename);
    req.body.thumbnails[1] = resp.secure_url;
    req.body.thumbnailsPublicId[1] = resp.public_id;
  }

  next();
};

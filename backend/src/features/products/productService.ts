import { Request } from 'express';
import Product from './productModel';
import { v2 as cloudinary } from 'cloudinary';
import * as AppError from '../../errors/appError';

export const deleteProduct = async (req: Request) => {
  const product = await Product.findById(req.params.id);

  // Check if product exist
  if (!product) {
    throw new AppError.NotFoundError(
      'We could not find the product resource you are looking for.'
    );
  }

  // Check and delete product image
  if (product.productImagePublicId) {
    await cloudinary.uploader.destroy(product.productImagePublicId);
  }

  // Check and delete thumbnails image.
  if (product.thumbnailsPublicId) {
    for (const publicId of product.thumbnailsPublicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }
  await product.deleteOne();
};

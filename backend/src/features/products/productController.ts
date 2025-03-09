import { NextFunction, Request, Response } from 'express';
import Product from './productModel';
import * as factory from '../../utils/handlerFactory';
import * as productService from './productService';
import * as utils from '../../utils';
import { checkForErrors } from '../../utils/validate';
import statusCodes from '../../errors/statusCodes';
import { body } from 'express-validator';
import { Types } from 'mongoose';
import * as AppError from '../../errors/appError';

export const uploadProductImages = utils.upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'thumbnails', maxCount: 2 },
]);

export const uploadUpdateProductImages = utils.upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'thumbOne', maxCount: 1 },
  { name: 'thumbTwo', maxCount: 1 },
]);

export const createProduct = factory.createOne({
  Model: Product,
  label: 'product',
  excludedFields: ['numOfReview', 'averageRating'],
});

export const getProducts = factory.getAll({
  Model: Product,
  label: 'products',
});
export const updateProduct = factory.updateOne({
  Model: Product,
  label: 'product',
});

export const getProduct = factory.getOne({
  Model: Product,
  label: 'product',
  populateOption: { path: 'reviews' },
});

export const deleteProduct = async (req: Request, res: Response) => {
  await productService.deleteProduct(req);
  res.status(statusCodes.NO_CONTENT).json({ status: 'success' });
};

export const setSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.productName && !req.body.slug)
    req.body.slug = utils.slugifyInput(req.body.productName);
  next();
};

export const validateProductPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.discountPrice > req.body.sellingPrice) {
    throw new AppError.BadRequestError(
      'Discount price must be lower than selling price.'
    );
  }

  if (
    req.body.costPrice > req.body.discountPrice ||
    req.body.costPrice > req.body.sellingPrice
  ) {
    throw new AppError.BadRequestError(
      'Cost price is lower than sales price which would mean selling at loss. Please check again. '
    );
  }
  next();
};

export const validateProduct = checkForErrors([
  body('productName').notEmpty().withMessage('Product name field is required.'),
  body('category')
    .notEmpty()
    .withMessage('Category field is required.')
    .custom((value) => Types.ObjectId.isValid(value))
    .withMessage('Invalid category value'),
  body('subcategory')
    .notEmpty()
    .withMessage('Subcategory field is required.')
    .custom((value) => Types.ObjectId.isValid(value))
    .withMessage('Invalid subcategory value'),
  body('quantity').notEmpty().withMessage('Quantity field is required.'),
  body('sellingPrice')
    .notEmpty()
    .withMessage('Selling price field is required.'),
  body('costPrice').notEmpty().withMessage('Cost price field is required.'),
  body('productImage')
    .notEmpty()
    .withMessage('Product image field is required.'),
  body('thumbnails')
    .notEmpty()
    .withMessage('Product thumbnails field is required.'),
  body('shortDesc')
    .notEmpty()
    .withMessage('Short description field is required.'),
  body('description')
    .notEmpty()
    .withMessage('Long description field is required.'),
]);

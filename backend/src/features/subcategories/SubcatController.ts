import { NextFunction, Request, Response } from 'express';
import { slugifyInput } from '../../utils';
import * as factory from '../../utils/handlerFactory';
import Subcategory from './subCatModel';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';
import { Types } from 'mongoose';

export const createSubCatory = factory.createOne({
  Model: Subcategory,
  label: 'subcategory',
});

export const getSubcategories = factory.getAll({
  Model: Subcategory,
  label: 'subcategories',
});

export const updateSubcategory = factory.updateOne({
  Model: Subcategory,
  label: 'subcategory',
});

export const getSubcategory = factory.getOne({
  Model: Subcategory,
  label: 'subcategory',
});

export const deleteSubcategory = factory.deleteOne({
  Model: Subcategory,
  label: 'subcategory',
});

export const setSlug = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.subcategory && !req.body.slug)
    req.body.slug = slugifyInput(req.body.subcategory);

  next();
};

export const validateSubCategory = checkForErrors([
  body('category')
    .notEmpty()
    .withMessage('Category field is required.')
    .custom((value) => Types.ObjectId.isValid(value))
    .withMessage('Category input is invalid.'),
  body('subcategory').notEmpty().withMessage('Subcategory field is required.'),
]);

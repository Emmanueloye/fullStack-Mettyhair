import { NextFunction, Request, Response } from 'express';
import * as factory from '../../utils/handlerFactory';
import Review from './reviewModel';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';

export const createReview = factory.createOne({
  Model: Review,
  label: 'review',
  includedFields: ['rating', 'review', 'user', 'product'],
});

export const getAllReviews = factory.getAll({
  Model: Review,
  label: 'reviews',
});

export const getReview = factory.getOne({ Model: Review, label: 'review' });

export const updateReview = factory.updateOne({
  Model: Review,
  label: 'review',
  includedFields: [
    'isApproved',
    'approvedBy',
    'approvedDate',
    'rating',
    'review',
  ],
});

export const deleteReview = factory.deleteOne({
  Model: Review,
  label: 'review',
});

export const setReviewCreateData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.product) req.body.product = req.params.productId;

  if (!req.body.user) req.body.user = req.user!.id;

  next();
};

export const setReviewUpdateData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.isApproved) {
    req.body.approvedBy = req.user!.id;
    req.body.approvedDate = Date.now();
  }

  next();
};

export const validateReview = checkForErrors([
  body('rating').notEmpty().withMessage('Rating field is required.'),
  body('review').notEmpty().withMessage('Review field is required.'),
]);

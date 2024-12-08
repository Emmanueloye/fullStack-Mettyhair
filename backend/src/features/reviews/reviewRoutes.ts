import { Router } from 'express';
import * as reviewController from './reviewController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import { validateParams } from '../../utils/validate';

const router = Router({ mergeParams: true });

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('user', 'super-admin'),
    reviewController.setReviewCreateData,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    reviewController.setReviewUpdateData,
    reviewController.updateReview
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    reviewController.getReview
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    reviewController.deleteReview
  );

export default router;

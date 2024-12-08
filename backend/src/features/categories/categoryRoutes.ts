import { Router } from 'express';
import * as categoryController from './categoryController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as setBodyMiddleware from '../../middlewares/setBodyMiddleware';
import { validateParams } from '../../utils/validate';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    categoryController.uploadPhoto,
    categoryController.processImage,
    categoryController.setSlug,
    setBodyMiddleware.setCreationDetails,
    categoryController.createCategory
  )
  .get(categoryController.getCategories);

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    categoryController.uploadPhoto,
    categoryController.processImage,
    setBodyMiddleware.setUpdateDetails,
    categoryController.setSlug,
    categoryController.updateCategory
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    categoryController.getCategory
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    categoryController.deleteCategory
  );

export default router;

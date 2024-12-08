import { Router } from 'express';
import * as subcategoryController from './SubcatController';
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
    subcategoryController.validateSubCategory,
    subcategoryController.setSlug,
    setBodyMiddleware.setCreationDetails,
    subcategoryController.createSubCatory
  )
  .get(subcategoryController.getSubcategories);

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    // subcategoryController.validateSubCategory,
    subcategoryController.setSlug,
    setBodyMiddleware.setUpdateDetails,
    subcategoryController.updateSubcategory
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    subcategoryController.getSubcategory
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    subcategoryController.deleteSubcategory
  );

export default router;

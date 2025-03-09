import { Router } from 'express';
import * as productController from './productController';
import * as imageController from './ProductImageController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as setBodyMiddleware from '../../middlewares/setBodyMiddleware';
import { validateParams } from '../../utils/validate';
import reviewRoutes from '../../features/reviews/reviewRoutes';

const router = Router();

router.use('/:productId/reviews', reviewRoutes);

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    productController.uploadProductImages,
    imageController.processProductImages,
    setBodyMiddleware.setCreationDetails,
    productController.setSlug,
    productController.validateProduct,
    productController.validateProductPrices,
    productController.createProduct
  )
  .get(productController.getProducts);

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    productController.uploadUpdateProductImages,
    imageController.updateProductImage,
    setBodyMiddleware.setUpdateDetails,
    productController.setSlug,
    productController.updateProduct
  )
  .get(productController.getProduct)
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    // authMiddleware.checkAccess,
    validateParams,
    productController.deleteProduct
  );

export default router;

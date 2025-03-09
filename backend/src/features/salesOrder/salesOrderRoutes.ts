import { Router } from 'express';
import * as salesOrderController from './salesOrderController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin', 'wholesaler'),
    salesOrderController.validateUserInput,
    salesOrderController.createOrder
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.getSalesOrders
  );

router
  .route('/wholeseller')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('wholesaler'),
    salesOrderController.wholeSellerOrders
  );

router
  .route('/pay')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.validatePayment,
    salesOrderController.payCreation
  );

router
  .route('/invoice/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.invoiceOrder
  );

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin', 'wholesaler'),
    salesOrderController.updateSalesOrder
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin', 'wholesaler'),
    salesOrderController.getSalesOrder
  )
  .delete();

export default router;

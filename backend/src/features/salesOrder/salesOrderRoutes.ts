import { Router } from 'express';
import * as salesOrderController from './salesOrderController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.createOrder
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.getSalesOrders
  );

router
  .route('/invoice/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.invoiceOrder
  );

router
  .route('/pay/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.payOnInvoice
  );

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.updateSalesOrder
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    salesOrderController.getSalesOrder
  )
  .delete();

export default router;

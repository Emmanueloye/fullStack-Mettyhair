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

router.route('/:id').patch().get().delete();

export default router;

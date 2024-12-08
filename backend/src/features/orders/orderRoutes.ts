import { Router } from 'express';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as orderController from './orderController';
const router = Router();

router.route('/me').get(authMiddleware.protect, orderController.getUserOrder);

router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    orderController.getAllOrders
  );

router
  .route('/:id')
  .get(authMiddleware.protect, orderController.getOrder)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    orderController.setOrderUpdate,
    orderController.updateOrder
  );

export default router;

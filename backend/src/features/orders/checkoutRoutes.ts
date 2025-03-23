import { Router } from 'express';
import * as checkoutController from './checkoutController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    checkoutController.validateCheckout,
    checkoutController.checkout
  );
router.route('/webhook').post(checkoutController.verifyCheckout);

router
  .route('/confirm-payment')
  .get(authMiddleware.protect, checkoutController.paymentConfirmation);

router.route('/validate').get(checkoutController.dhl);
router.route('/rates').get(checkoutController.getDHLRate);

export default router;

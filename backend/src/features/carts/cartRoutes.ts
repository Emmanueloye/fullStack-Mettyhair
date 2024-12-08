import { Router } from 'express';
import * as cartController from './cartController';

const router = Router();

router
  .route('/')
  .post(cartController.addToCart)
  .get(cartController.getAllCarts);

router
  .route('/:id')
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

export default router;

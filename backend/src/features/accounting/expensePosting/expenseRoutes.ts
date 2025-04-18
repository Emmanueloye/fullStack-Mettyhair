import { Router } from 'express';
import * as expenseController from './expenseController';
import * as authMiddleware from '../../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    expenseController.getAllExpenses
  )
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    expenseController.postExpenses
  );

export default router;

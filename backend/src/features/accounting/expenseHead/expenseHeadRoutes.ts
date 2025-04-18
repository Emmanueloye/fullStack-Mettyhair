import { Router } from 'express';
import * as expenseHeadController from './expenseHeadController';
import * as authMiddleware from '../../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    expenseHeadController.CreateExpenseHeadMiddleware,
    expenseHeadController.createExpenseHead
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    expenseHeadController.getExpenseHeads
  );

router
  .route('/:id')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    expenseHeadController.getExpenseHead
  )
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    expenseHeadController.updateExpenseHeadMiddleware,
    expenseHeadController.updateExpenseHead
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    expenseHeadController.deleteExpenseHead
  );

export default router;

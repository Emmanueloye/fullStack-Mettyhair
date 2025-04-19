import { Router } from 'express';
import * as reportController from '../accounting/reportController';
import * as authMiddleware from '../../middlewares/authMiddleware';
const router = Router();

router
  .route('/statement')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('wholesaler', 'admin', 'super-admin'),
    reportController.validateDateInput,
    reportController.customerStatement
  );

router
  .route('/sales')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    reportController.validateSalesDateInput,
    reportController.salesReports
  );

router
  .route('/profit-or-loss')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    reportController.validateDateInput,
    reportController.profitAndLossReport
  );

export default router;

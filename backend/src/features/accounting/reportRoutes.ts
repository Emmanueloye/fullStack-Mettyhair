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

router.route('/sales').post(reportController.salesReports);

export default router;

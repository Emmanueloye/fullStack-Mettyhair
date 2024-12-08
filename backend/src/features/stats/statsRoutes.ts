import { Router } from 'express';
import * as statsController from './statsController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router
  .route('/dashboard-metrics')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    statsController.dashboardMetrics
  );

export default router;

import { Router } from 'express';
import * as devController from './devController';

const router = Router();

router
  .route('/dev')
  .get(devController.uploadDevData)
  .delete(devController.deleteDevData);

export default router;

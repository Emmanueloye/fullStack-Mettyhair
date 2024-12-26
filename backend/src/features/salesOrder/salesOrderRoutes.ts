import { Router } from 'express';
import * as salesOrderController from './salesOrderController';

const router = Router();

router.route('/').post(salesOrderController.createOrder).get();

router.route('/:id').patch().get().delete();

export default router;

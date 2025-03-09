import { Router } from 'express';
import * as locationController from './locationController';

const router = Router();

router.route('/countries').get(locationController.getCountries);
router.route('/states').get(locationController.getStates);
router.route('/cities').get(locationController.getCities);

export default router;

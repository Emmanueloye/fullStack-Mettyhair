import { Router } from 'express';
import * as settingController from './settingController';

const router = Router();

router.route('/').post(settingController.saveSetting);

router.route('/').get(settingController.getSetting);

router.route('/:id').patch(settingController.updateSetting);

export default router;

import { Router } from 'express';
import * as sliderController from './sliderController';
import * as authMiddleware from '../../middlewares/authMiddleware';
const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    sliderController.uploadSlider,
    sliderController.processImage,
    sliderController.setCreationData,
    sliderController.createSlider
  )
  .get(sliderController.getSliders);

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    sliderController.uploadSlider,
    sliderController.processImage,
    sliderController.setUpdateData,
    sliderController.updateSlider
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    sliderController.uploadSlider,
    sliderController.processImage,
    sliderController.getSlider
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    sliderController.deleteSlider
  );

export default router;

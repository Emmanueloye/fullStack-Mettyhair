import { Router } from 'express';
import * as authController from './authController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as authValidate from './authValidation';

const router = Router();

router.route('/signup').post(authController.signup);

router
  .route('/verify-email')
  .post(authController.switchParams, authController.verifyEmail);

router
  .route('/login')
  .post(authValidate.validateLoginInputs, authController.login);

router
  .route('/forget-password')
  .post(authValidate.validateForgetPassInput, authController.forgetPassword);

router
  .route('/reset-password')
  .patch(
    authValidate.validateResetPassInput,
    authController.switchParams,
    authController.resetPassword
  );

router.route('/logout').delete(authMiddleware.protect, authController.logout);
export default router;

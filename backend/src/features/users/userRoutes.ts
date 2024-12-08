import { Router } from 'express';
import * as userController from './userController';
import * as authMiddleware from '../../middlewares/authMiddleware';
const router = Router();

router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.getUsers
  );

router
  .route('/create-admin')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.validateAdminCreation,
    userController.createAdmin
  );

router
  .route('/update-password')
  .patch(
    authMiddleware.protect,
    userController.validatePasswordUpdate,
    userController.updatePassword
  );

router
  .route('/me')
  .get(
    authMiddleware.protect,
    userController.switchUserId,
    userController.getMe
  )
  .patch(
    authMiddleware.protect,
    userController.switchUserId,
    userController.uploadPhoto,
    userController.processImage,
    userController.updateLoginUser
  );

router
  .route('/update-address')
  .patch(
    authMiddleware.protect,
    userController.validateAddressBook,
    userController.switchUserId,
    userController.updateUserAddress
  );

router
  .route('/user-report')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.userReports
  );

router
  .route('/user-report')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.userReports
  );

router
  .route('/get-user-report')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.userReports
  );
// router
//   .route('/update-access')
//   .patch(
//     authMiddleware.protect,
//     authMiddleware.restrictTo('super-admin', 'admin'),
//     authMiddleware.checkAccess,
//     userController.updateAccess
//   );

router
  .route('/role/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.updateUserRole
  );

router
  .route('/restrict/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.restrictUser
  );

router
  .route('/:id')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin'),
    userController.getUser
  );

export default router;

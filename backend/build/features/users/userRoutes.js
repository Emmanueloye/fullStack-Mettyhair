"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("./userController"));
const authMiddleware = __importStar(require("../../middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router
    .route('/')
    .get(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.getUsers);
router
    .route('/create-admin')
    .post(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.validateAdminCreation, userController.createAdmin);
router
    .route('/update-password')
    .patch(authMiddleware.protect, userController.validatePasswordUpdate, userController.updatePassword);
router
    .route('/me')
    .get(authMiddleware.protect, userController.switchUserId, userController.getMe)
    .patch(authMiddleware.protect, userController.switchUserId, userController.uploadPhoto, userController.processImage, userController.updateLoginUser);
router
    .route('/update-address')
    .patch(authMiddleware.protect, userController.validateAddressBook, userController.switchUserId, userController.updateUserAddress);
router
    .route('/user-report')
    .get(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.userReports);
router
    .route('/user-report')
    .post(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.userReports);
router
    .route('/get-user-report')
    .get(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.userReports);
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
    .patch(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.updateUserRole);
router
    .route('/restrict/:id')
    .patch(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.restrictUser);
router
    .route('/:id')
    .get(authMiddleware.protect, authMiddleware.restrictTo('super-admin'), userController.getUser);
exports.default = router;

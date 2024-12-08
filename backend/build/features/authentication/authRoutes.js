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
const authController = __importStar(require("./authController"));
const authMiddleware = __importStar(require("../../middlewares/authMiddleware"));
const authValidate = __importStar(require("./authValidation"));
const router = (0, express_1.Router)();
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
    .patch(authValidate.validateResetPassInput, authController.switchParams, authController.resetPassword);
router.route('/logout').delete(authMiddleware.protect, authController.logout);
exports.default = router;

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchParams = exports.logout = exports.resetPassword = exports.forgetPassword = exports.login = exports.verifyEmail = exports.signup = void 0;
const authService = __importStar(require("./authService"));
const tokenModel_1 = __importDefault(require("./tokenModel"));
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
const utils = __importStar(require("../../utils"));
/*================================================================================================
===================================Controllers Handlers===========================================
================================================================================================*/
// Signup handler
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a copy of request body
    const userData = Object.assign({}, req.body);
    // Call authservice to create user
    yield authService.createUser(userData);
    //   Send response back to the user.
    res.status(statusCodes_1.default.CREATED).json({
        status: 'success',
        message: 'Please check your email for your verification email. You will not be able to sign in without verifying your email.',
    });
});
exports.signup = signup;
// Verify email handler
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a copy of request body
    const userData = Object.assign({}, req.body);
    // Call authservice to create user
    yield authService.verifyUserEmail(userData);
    res.status(statusCodes_1.default.OK).json({
        status: 'success',
        message: 'Email verified. Welcome to the queens community. Please proceed to login.',
    });
});
exports.verifyEmail = verifyEmail;
// login handler
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = Object.assign({}, req.body);
    // Call authservice to login user
    yield authService.loginUser(userData, req, res);
});
exports.login = login;
// forget password handler
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = Object.assign({}, req.body);
    yield authService.userForgetPassword(userData);
    // respond to user
    res.status(statusCodes_1.default.OK).json({
        status: 'success',
        message: 'Please check your email for your reset password link.',
    });
});
exports.forgetPassword = forgetPassword;
// reset password handler
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = Object.assign({}, req.body);
    yield authService.userResetPassword(userData);
    res.status(statusCodes_1.default.OK).json({
        status: 'success',
        message: 'Please, login with your new credentials.',
    });
});
exports.resetPassword = resetPassword;
// logout user
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield tokenModel_1.default.deleteOne({ userId: req.user.id });
    utils.logoutToken(res);
    res.status(statusCodes_1.default.NO_CONTENT).json({ status: 'success' });
});
exports.logout = logout;
/*================================================================================================
=====================Validation and Params Switching Middlewares==================================
================================================================================================*/
// This middleware make it possible to either set the verification token as the body or the request or as a query params. Whichever one that is present will eventually be set on the req.body.
const switchParams = (req, res, next) => {
    if (!req.body.email)
        req.body.email = req.query.email;
    if (!req.body.token)
        req.body.token = req.query.token;
    next();
};
exports.switchParams = switchParams;

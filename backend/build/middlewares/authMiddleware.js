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
exports.checkAccess = exports.restrictTo = exports.protect = void 0;
const userModel_1 = __importDefault(require("../features/authentication/userModel"));
const tokenModel_1 = __importDefault(require("../features/authentication/tokenModel"));
const AppError = __importStar(require("../errors/appError"));
const utils = __importStar(require("../utils"));
const accessModel_1 = __importDefault(require("../features/authentication/accessModel"));
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ originalURL: req.originalUrl });
    // console.log({ baseURL: req.baseUrl });
    // console.log({ url: req.url });
    // console.log(req);
    // get the signed token of the login user.
    const { accessToken, refreshToken } = req.signedCookies;
    if (accessToken) {
        // verify the token and get out user id from it..
        const decoded = yield utils.verifyJWT(accessToken);
        const { payload: { token: userId }, iat, } = decoded;
        // Get the currently logged in user
        const currentUser = yield userModel_1.default.findById(userId);
        const existingtoken = yield tokenModel_1.default.findOne({ userId });
        // Check if user exist.
        if (!currentUser) {
            throw new AppError.UnAuthenticatedError('User with this credentials no longer exist.');
        }
        // Check if user has not been banned from using the app.
        if (!(existingtoken === null || existingtoken === void 0 ? void 0 : existingtoken.isValid)) {
            throw new AppError.UnAuthenticatedError('Your access to this app has been restricted.Please contact admin.');
        }
        // Check if there is a recent password change.
        if (currentUser.detectPasswordChange(iat)) {
            throw new AppError.UnAuthenticatedError('Password change detected. Please login again.');
        }
        utils.sendCookies({
            res,
            token: currentUser.id,
            refresh: existingtoken.refreshToken,
        });
        req.user = currentUser;
        return next();
    }
    const decode = yield utils.verifyJWT(refreshToken);
    const { payload: { token: userId, refresh }, iat, } = decode;
    // Get the currently logged in user
    const currentUser = yield userModel_1.default.findById(userId);
    const existingtoken = yield tokenModel_1.default.findOne({ userId, refreshToken: refresh });
    // Check if user exist.
    if (!currentUser) {
        throw new AppError.UnAuthenticatedError('User with this credentials no longer exist.');
    }
    // Check if user has not been banned from using the app.
    if (!(existingtoken === null || existingtoken === void 0 ? void 0 : existingtoken.isValid)) {
        throw new AppError.UnAuthenticatedError('Your access to this app has been restricted.Please contact admin.');
    }
    // Check if there is a recent password change.
    if (currentUser.detectPasswordChange(iat)) {
        throw new AppError.UnAuthenticatedError('Password change detected. Please login again.');
    }
    utils.sendCookies({
        res,
        token: currentUser.id,
        refresh: existingtoken.refreshToken,
    });
    req.user = currentUser;
    next();
});
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if role of the currently logged in user have permission to view the route.
        if (req.user && !roles.includes(req.user.role)) {
            throw new AppError.NotFoundError('Page not found on our server here.');
        }
        next();
    });
};
exports.restrictTo = restrictTo;
const checkAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get list of routes users have access to from access db with the already logged in user.
    const accessList = yield accessModel_1.default.findOne({ userId: req.user.id });
    // Check if the currently logged in user have permission to view the route.
    const invalidAccess = !(accessList === null || accessList === void 0 ? void 0 : accessList.permittedRoutes.includes(utils.getPathText(req.baseUrl)));
    if (invalidAccess) {
        throw new AppError.NotFoundError('Page not found on our server here.');
    }
    next();
});
exports.checkAccess = checkAccess;

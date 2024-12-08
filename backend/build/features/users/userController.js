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
exports.validateAddressBook = exports.validateAdminCreation = exports.validatePasswordUpdate = exports.switchUserId = exports.processImage = exports.userReports = exports.restrictUser = exports.updateUserRole = exports.updateAccess = exports.updateUserAddress = exports.updateLoginUser = exports.getUser = exports.getMe = exports.updatePassword = exports.createAdmin = exports.getUsers = exports.uploadPhoto = void 0;
const userModel_1 = __importDefault(require("../authentication/userModel"));
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
const userService = __importStar(require("./userService"));
const factory = __importStar(require("../../utils/handlerFactory"));
const utils = __importStar(require("../../utils"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const validate_1 = require("../../utils/validate");
const express_validator_1 = require("express-validator");
// To upload user image using multer.
exports.uploadPhoto = utils.upload.single('photo');
// Get all users
exports.getUsers = factory.getAll({ Model: userModel_1.default, label: 'users' });
// To create admin user
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userService.createNewAdmin(req);
    res
        .status(statusCodes_1.default.OK)
        .json({ status: 'success', message: 'Admin created successfully' });
});
exports.createAdmin = createAdmin;
// To update user password when logged in.
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // update user password
    yield userService.updateUserPassword(req);
    utils.logoutToken(res);
    res.status(statusCodes_1.default.OK).json({
        status: 'success',
        message: 'Password updated. Login with your new credentials.',
    });
});
exports.updatePassword = updatePassword;
// Get current logged in user
exports.getMe = factory.getOne({
    Model: userModel_1.default,
    label: 'user',
    populateOption: { path: 'access' },
});
// Get single user for admin route.
exports.getUser = factory.getOne({
    Model: userModel_1.default,
    label: 'user',
    populateOption: { path: 'token', select: 'isValid' },
});
// Update current logged in user.
exports.updateLoginUser = factory.updateOne({
    Model: userModel_1.default,
    label: 'user',
    includedFields: ['fullName', 'photo', 'photoPublicId'],
});
// Update current logged in user's address
exports.updateUserAddress = factory.updateOne({
    Model: userModel_1.default,
    label: 'user',
    includedFields: ['address', 'state', 'country'],
});
// For super-admin only: to update admin module admin will have access to.
const updateAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userService.updateUserAccess(req);
    res
        .status(statusCodes_1.default.OK)
        .json({ status: 'success', message: 'Access updated.' });
});
exports.updateAccess = updateAccess;
// For super-admin only: to update user role
exports.updateUserRole = factory.updateOne({
    Model: userModel_1.default,
    label: 'user',
    includedFields: ['role'],
});
// For super-admin only: to update app access
const restrictUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userService.restrictUser(req);
    res.status(statusCodes_1.default.OK).json({
        status: 'success',
        message: 'User access to app has been updated.',
    });
});
exports.restrictUser = restrictUser;
// users report for admin route.
const userReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { users, page } = yield userService.userReport(req);
    res
        .status(statusCodes_1.default.OK)
        .json({ status: 'success', noHits: users.length, page, users });
});
exports.userReports = userReports;
// user image processing.
const processImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield userModel_1.default.findById(req.user.id);
    // If user does not update image, move on to the next middleware.
    if (!req.file)
        return next();
    //   Put the file path on the body
    const fileName = `${req.user.id}-${req.file.originalname
        .split('.')
        .at(0)}.jpeg`;
    yield (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .toFile(`public/upload/${fileName}`);
    if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.photoPublicId) {
        yield cloudinary_1.v2.uploader.destroy(currentUser.photoPublicId);
    }
    const resp = yield cloudinary_1.v2.uploader.upload(`public/upload/${fileName}`);
    yield promises_1.default.unlink(`public/upload/${fileName}`);
    req.body.photo = resp.secure_url;
    req.body.photoPublicId = resp.public_id;
    next();
});
exports.processImage = processImage;
// Middleware for switching logged in user id with the params.id setup.
const switchUserId = (req, res, next) => {
    var _a;
    if (!req.params.id) {
        if (req.user && req.user.id) {
            req.params.id = (_a = req.user.id) === null || _a === void 0 ? void 0 : _a.toString();
        }
    }
    next();
};
exports.switchUserId = switchUserId;
// Validate user password update.
exports.validatePasswordUpdate = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('oldPassword')
        .notEmpty()
        .withMessage('Current password field is required.'),
    (0, express_validator_1.body)('newPassword').notEmpty().withMessage('New password field is required.'),
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty()
        .withMessage('Confirm Password field is required.'),
]);
// Validate admin creation route (admin)
exports.validateAdminCreation = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('Full name field is required.'),
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email field is required.'),
    (0, express_validator_1.body)('role').notEmpty().withMessage('User role field is required.'),
]);
// Validate address book update.
exports.validateAddressBook = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('address').notEmpty().withMessage('Address field cannot be empty.'),
    (0, express_validator_1.body)('state').notEmpty().withMessage('State field cannot be empty.'),
    (0, express_validator_1.body)('country').notEmpty().withMessage('Country field cannot be empty.'),
]);

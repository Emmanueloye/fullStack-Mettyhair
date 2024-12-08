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
exports.userResetPassword = exports.userForgetPassword = exports.loginUser = exports.verifyUserEmail = exports.createUser = void 0;
const userModel_1 = __importDefault(require("./userModel"));
const tokenModel_1 = __importDefault(require("./tokenModel"));
const utils = __importStar(require("../../utils"));
const AppError = __importStar(require("../../errors/appError"));
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the specific properties from body
    const { fullName, email, password, confirmPassword } = userData;
    //   Generate email verification token - send plain token to user and save hashed token to the database.
    const [plainToken, hashToken] = utils.generateToken({});
    // Create new user
    yield userModel_1.default.create({
        fullName,
        email,
        password,
        confirmPassword,
        emailVerificationToken: hashToken,
    });
    // send verification email
    const url = `${process.env.BASE_URL}/verify-email?email=${email}&token=${plainToken}`;
    const data = { name: fullName.split(' ')[0], email, url };
    yield utils.Email.sendVerificationEmail(data);
});
exports.createUser = createUser;
const verifyUserEmail = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the email and token from the query parameters
    const { email, token } = userData;
    // fetch user with the verification details
    const user = yield userModel_1.default.findOne({
        email,
        emailVerificationToken: utils.generateToken({ type: 'hash', token }),
    });
    // check if user is not is not available.
    if (!user) {
        throw new AppError.BadRequestError('Account verification Failed due to invalid credentials.');
    }
    // if user is available, set verification credentials
    user.emailVerificationToken = undefined;
    user.isVerified = true;
    user.verifiedDate = new Date(Date.now());
    yield user.save({ validateBeforeSave: false });
});
exports.verifyUserEmail = verifyUserEmail;
const loginUser = (userData, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get email and password from the body.
    const { email, password } = userData;
    //get user with the email
    const user = yield userModel_1.default.findOne({ email }).select('+password');
    // check if user exist and password is correct
    if (!user || !(yield user.isPasswordCorrect(password, user.password))) {
        throw new AppError.UnAuthenticatedError('Invalid email or password.');
    }
    // check if user email is verified
    if (!user.isVerified) {
        throw new AppError.UnAuthenticatedError('Email is not verified. Please verify your email.');
    }
    // get the user existing refreshtoken from token db
    const existingtoken = yield tokenModel_1.default.findOne({ userId: user.id });
    // check if the token exist and is valid log user in.
    if (existingtoken) {
        if (!existingtoken.isValid) {
            throw new AppError.UnAuthenticatedError('Your access to this app has been restricted. Please contact the app admin');
        }
        // Login users by sending cookies (access and refresh token) to user
        utils.sendCookies({
            res,
            token: user.id,
            refresh: existingtoken.refreshToken,
        });
        res
            .status(statusCodes_1.default.OK)
            .json({ status: 'success', message: 'Login successfully.' });
        return;
    }
    // if no, create a new refresh token and log user in.
    const token = yield tokenModel_1.default.create({
        refreshToken: utils.generateToken({ type: 'plain' }),
        userId: user.id,
        userIP: req.ip,
        userAgent: req.header('user-agent'),
    });
    utils.sendCookies({ res, token: user.id, refresh: token.refreshToken });
    res
        .status(statusCodes_1.default.OK)
        .json({ status: 'success', message: 'Login successfully.' });
});
exports.loginUser = loginUser;
const userForgetPassword = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // get email from the body.
    const { email } = userData;
    // get user with the email.
    const user = yield userModel_1.default.findOne({ email });
    // if there is user: set passwordreset token, password token expiration.
    if (user) {
        const [plainToken, hashToken] = utils.generateToken({});
        const minutes = 1000 * 60 * Number(process.env.PASSWORD_RESET_EXPIRES);
        try {
            user.passwordResetToken = hashToken;
            user.passwordTokenExpiresAt = new Date(Date.now() + minutes);
            yield user.save({ validateBeforeSave: false });
            // send email with password reset link.
            const url = `${process.env.BASE_URL}/reset-password?email=${email}&token=${plainToken}`;
            const data = { name: user.fullName.split(' ').at(0), url, email };
            utils.Email.sendPasswordResetEmail(data);
        }
        catch (error) {
            // if error, unset the properties set in the try block.
            user.passwordResetToken = undefined;
            user.passwordTokenExpiresAt = undefined;
            yield user.save({ validateBeforeSave: false });
        }
    }
});
exports.userForgetPassword = userForgetPassword;
const userResetPassword = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // get required fields from body
    const { email, token, password, confirmPassword } = userData;
    // get user with email and valid token (i.e correct and unexpired token)
    const user = yield userModel_1.default.findOne({
        email,
        passwordResetToken: utils.generateToken({ type: 'hash', token }),
        passwordTokenExpiresAt: { $gt: Date.now() },
    });
    // Check if user exist
    if (!user) {
        throw new AppError.UnAuthenticatedError('Invalid reset token credentials. Please, start the process again.');
    }
    // if user exist, reset password and set password reset details to undefined.
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordChangedAt = new Date(Date.now());
    user.passwordResetToken = undefined;
    user.passwordTokenExpiresAt = undefined;
    yield user.save();
});
exports.userResetPassword = userResetPassword;

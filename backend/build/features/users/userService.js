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
exports.restrictUser = exports.updateUserAccess = exports.userReport = exports.updateUserPassword = exports.createNewAdmin = void 0;
const userModel_1 = __importDefault(require("../authentication/userModel"));
const accessModel_1 = __importDefault(require("../authentication/accessModel"));
const tokenModel_1 = __importDefault(require("../authentication/tokenModel"));
const AppError = __importStar(require("../../errors/appError"));
const utils = __importStar(require("../../utils"));
const createNewAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Create Temporary admin password
    const tempPassword = utils.generateToken({ type: 'plain' }).slice(0, 9);
    // Get requested body from the request body.
    const { fullName, email, role } = req.body;
    yield userModel_1.default.create({
        fullName,
        email,
        role,
        isVerified: true,
        verifiedDate: Date.now(),
        password: tempPassword,
        confirmPassword: tempPassword,
    });
    // Email data
    const data = {
        name: fullName.split(' ')[0],
        email,
        password: tempPassword,
    };
    // Send email to the user.
    yield utils.Email.sendAdminEmailVerification(data);
});
exports.createNewAdmin = createNewAdmin;
const updateUserPassword = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Get required information from request body.
    const { oldPassword, newPassword, confirmPassword } = req.body;
    // Get currently logged in user
    const user = yield userModel_1.default.findById(req.user.id).select('+password');
    // Check if the old password is correct.
    if (!(yield (user === null || user === void 0 ? void 0 : user.isPasswordCorrect(oldPassword, user.password)))) {
        throw new AppError.BadRequestError('Incorrect password.');
    }
    // If password is correct, update the password.
    user.password = newPassword;
    user.confirmPassword = confirmPassword;
    user.passwordChangedAt = new Date(Date.now());
    yield user.save();
});
exports.updateUserPassword = updateUserPassword;
const userReport = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const [startDate, endDate] = utils.reportDate(req);
    const filterObj = {
        createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        },
    };
    const userQuery = new utils.GetRequestAPI(userModel_1.default.find(filterObj), req.query)
        .filter()
        .sort()
        .limitFields()
        .limitDocuments()
        .paginate();
    const users = yield userQuery.query;
    const queryReq = new utils.GetRequestAPI(userModel_1.default.find(filterObj), req.query)
        .filter()
        .sort()
        .limitFields();
    const documentCount = yield queryReq.query.countDocuments();
    let page;
    if (req.query.page)
        page = utils.paginateDetails(documentCount, req);
    return { users, page };
});
exports.userReport = userReport;
const updateUserAccess = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, permittedRoutes } = req.body;
    const user = yield accessModel_1.default.findOneAndUpdate({ userId }, { permittedRoutes }, { new: true });
    if (!user) {
        throw new AppError.NotFoundError('We do not have the user resource you are looking for.');
    }
});
exports.updateUserAccess = updateUserAccess;
const restrictUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { restrict } = req.body;
    const isValid = restrict === 'true';
    const restrictedUser = yield tokenModel_1.default.findOneAndUpdate({ userId: req.params.id }, { isValid }, { new: true });
    if (!restrictedUser) {
        throw new AppError.BadRequestError('Please wait for the user to logged in to restrict their access to the application.');
    }
});
exports.restrictUser = restrictUser;

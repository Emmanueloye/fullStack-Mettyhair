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
const statusCodes_1 = __importDefault(require("../errors/statusCodes"));
const AppError = __importStar(require("../errors/appError"));
const cloudinary_1 = require("cloudinary");
const sendError = (res, err) => {
    if (err.isOperational) {
        res
            .status(err.statusCode)
            .json({ status: 'fail', message: err.msg, statusCode: err.statusCode });
    }
    else {
        res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Something went wrong. Please try again later.',
        });
    }
};
// Handles mongoose validation errors
const handleValidationErrors = (err) => {
    const msg = Object.values(err.errors)
        .map((val) => val.message)
        .join(',');
    return new AppError.BadRequestError(msg);
};
// Handles mongoose duplicate errors
const handleDuplicateError = (err) => {
    const value = Object.keys(err.keyValue)[0];
    const newVal = value.charAt(0).toUpperCase() + value.slice(1);
    return new AppError.BadRequestError(`${newVal} already in use. Please choose another value.`);
};
const globalErrorMiddleware = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let error = Object.assign({}, err);
    if (err.name === 'ValidationError')
        error = handleValidationErrors(err);
    if (err.code === 11000)
        error = handleDuplicateError(err);
    if (req.body.productImage) {
        yield cloudinary_1.v2.uploader.destroy(req.body.productImagePublicId);
    }
    if (req.body.thumbnails) {
        req.body.thumbnailsPublicId.forEach((publicId) => __awaiter(void 0, void 0, void 0, function* () {
            yield cloudinary_1.v2.uploader.destroy(publicId);
        }));
    }
    // sendError(res, error);
    res
        .status(err.statusCode || statusCodes_1.default.INTERNAL_SERVER_ERROR)
        .json({ status: error.status, err, stack: err.stack });
});
exports.default = globalErrorMiddleware;

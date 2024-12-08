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
exports.validateParams = exports.checkForErrors = void 0;
const express_validator_1 = require("express-validator");
const AppError = __importStar(require("../errors/appError"));
const mongoose_1 = require("mongoose");
const checkForErrors = (validatedInputs, errType = 400) => {
    return [
        validatedInputs,
        (req, res, next) => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                if (errType === 400) {
                    const errMsg = errors
                        .array()
                        .map((val) => val.msg)
                        .join(',');
                    throw new AppError.BadRequestError(errMsg);
                }
                if (errType === 401) {
                    const errMsg = errors
                        .array()
                        .map((val) => val.msg)
                        .join(',');
                    throw new AppError.UnAuthenticatedError(errMsg);
                }
            }
            next();
        },
    ];
};
exports.checkForErrors = checkForErrors;
exports.validateParams = (0, exports.checkForErrors)([
    (0, express_validator_1.param)('id')
        .custom((value) => mongoose_1.Types.ObjectId.isValid(value))
        .withMessage('No page found for the requested id'),
]);

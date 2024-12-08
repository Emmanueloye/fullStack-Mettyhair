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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReview = exports.setReviewUpdateData = exports.setReviewCreateData = exports.deleteReview = exports.updateReview = exports.getReview = exports.getAllReviews = exports.createReview = void 0;
const factory = __importStar(require("../../utils/handlerFactory"));
const reviewModel_1 = __importDefault(require("./reviewModel"));
const validate_1 = require("../../utils/validate");
const express_validator_1 = require("express-validator");
exports.createReview = factory.createOne({
    Model: reviewModel_1.default,
    label: 'review',
    includedFields: ['rating', 'review', 'user', 'product'],
});
exports.getAllReviews = factory.getAll({
    Model: reviewModel_1.default,
    label: 'reviews',
});
exports.getReview = factory.getOne({ Model: reviewModel_1.default, label: 'review' });
exports.updateReview = factory.updateOne({
    Model: reviewModel_1.default,
    label: 'review',
    includedFields: [
        'isApproved',
        'approvedBy',
        'approvedDate',
        'rating',
        'review',
    ],
});
exports.deleteReview = factory.deleteOne({
    Model: reviewModel_1.default,
    label: 'review',
});
const setReviewCreateData = (req, res, next) => {
    if (!req.body.product)
        req.body.product = req.params.productId;
    if (!req.body.user)
        req.body.user = req.user.id;
    next();
};
exports.setReviewCreateData = setReviewCreateData;
const setReviewUpdateData = (req, res, next) => {
    if (req.body.isApproved) {
        req.body.approvedBy = req.user.id;
        req.body.approvedDate = Date.now();
    }
    next();
};
exports.setReviewUpdateData = setReviewUpdateData;
exports.validateReview = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('rating').notEmpty().withMessage('Rating field is required.'),
    (0, express_validator_1.body)('review').notEmpty().withMessage('Review field is required.'),
]);

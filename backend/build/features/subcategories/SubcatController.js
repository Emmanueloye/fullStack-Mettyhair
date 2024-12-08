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
exports.validateSubCategory = exports.setSlug = exports.deleteSubcategory = exports.getSubcategory = exports.updateSubcategory = exports.getSubcategories = exports.createSubCatory = void 0;
const utils_1 = require("../../utils");
const factory = __importStar(require("../../utils/handlerFactory"));
const subCatModel_1 = __importDefault(require("./subCatModel"));
const validate_1 = require("../../utils/validate");
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
exports.createSubCatory = factory.createOne({
    Model: subCatModel_1.default,
    label: 'subcategory',
});
exports.getSubcategories = factory.getAll({
    Model: subCatModel_1.default,
    label: 'subcategories',
});
exports.updateSubcategory = factory.updateOne({
    Model: subCatModel_1.default,
    label: 'subcategory',
});
exports.getSubcategory = factory.getOne({
    Model: subCatModel_1.default,
    label: 'subcategory',
});
exports.deleteSubcategory = factory.deleteOne({
    Model: subCatModel_1.default,
    label: 'subcategory',
});
const setSlug = (req, res, next) => {
    if (req.body.subcategory && !req.body.slug)
        req.body.slug = (0, utils_1.slugifyInput)(req.body.subcategory);
    next();
};
exports.setSlug = setSlug;
exports.validateSubCategory = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('category')
        .notEmpty()
        .withMessage('Category field is required.')
        .custom((value) => mongoose_1.Types.ObjectId.isValid(value))
        .withMessage('Category input is invalid.'),
    (0, express_validator_1.body)('subcategory').notEmpty().withMessage('Subcategory field is required.'),
]);

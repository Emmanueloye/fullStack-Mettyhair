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
exports.validateProduct = exports.setSlug = exports.deleteProduct = exports.getProduct = exports.updateProduct = exports.getProducts = exports.createProduct = exports.uploadUpdateProductImages = exports.uploadProductImages = void 0;
const productModel_1 = __importDefault(require("./productModel"));
const factory = __importStar(require("../../utils/handlerFactory"));
const productService = __importStar(require("./productService"));
const utils = __importStar(require("../../utils"));
const validate_1 = require("../../utils/validate");
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
exports.uploadProductImages = utils.upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'thumbnails', maxCount: 2 },
]);
exports.uploadUpdateProductImages = utils.upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'thumbOne', maxCount: 1 },
    { name: 'thumbTwo', maxCount: 1 },
]);
exports.createProduct = factory.createOne({
    Model: productModel_1.default,
    label: 'product',
    excludedFields: ['numOfReview', 'averageRating'],
});
exports.getProducts = factory.getAll({
    Model: productModel_1.default,
    label: 'products',
});
exports.updateProduct = factory.updateOne({
    Model: productModel_1.default,
    label: 'product',
});
exports.getProduct = factory.getOne({
    Model: productModel_1.default,
    label: 'product',
    populateOption: { path: 'reviews' },
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield productService.deleteProduct(req);
    res.status(statusCodes_1.default.NO_CONTENT).json({ status: 'success' });
});
exports.deleteProduct = deleteProduct;
const setSlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.productName && !req.body.slug)
        req.body.slug = utils.slugifyInput(req.body.productName);
    next();
});
exports.setSlug = setSlug;
exports.validateProduct = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('productName').notEmpty().withMessage('Product name field is required.'),
    (0, express_validator_1.body)('category')
        .notEmpty()
        .withMessage('Category field is required.')
        .custom((value) => mongoose_1.Types.ObjectId.isValid(value))
        .withMessage('Invalid category value'),
    (0, express_validator_1.body)('subcategory')
        .notEmpty()
        .withMessage('Subcategory field is required.')
        .custom((value) => mongoose_1.Types.ObjectId.isValid(value))
        .withMessage('Invalid subcategory value'),
    (0, express_validator_1.body)('quantity').notEmpty().withMessage('Quantity field is required.'),
    (0, express_validator_1.body)('sellingPrice')
        .notEmpty()
        .withMessage('Selling price field is required.'),
    (0, express_validator_1.body)('costPrice').notEmpty().withMessage('Cost price field is required.'),
    (0, express_validator_1.body)('productImage')
        .notEmpty()
        .withMessage('Product image field is required.'),
    (0, express_validator_1.body)('thumbnails')
        .notEmpty()
        .withMessage('Product thumbnails field is required.'),
    (0, express_validator_1.body)('shortDesc')
        .notEmpty()
        .withMessage('Short description field is required.'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Long description field is required.'),
]);

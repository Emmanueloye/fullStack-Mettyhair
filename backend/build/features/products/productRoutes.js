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
const express_1 = require("express");
const productController = __importStar(require("./productController"));
const imageController = __importStar(require("./ProductImageController"));
const authMiddleware = __importStar(require("../../middlewares/authMiddleware"));
const setBodyMiddleware = __importStar(require("../../middlewares/setBodyMiddleware"));
const validate_1 = require("../../utils/validate");
const reviewRoutes_1 = __importDefault(require("../../features/reviews/reviewRoutes"));
const router = (0, express_1.Router)();
router.use('/:productId/reviews', reviewRoutes_1.default);
router
    .route('/')
    .post(authMiddleware.protect, authMiddleware.restrictTo('super-admin', 'admin'), 
// authMiddleware.checkAccess,
productController.uploadProductImages, imageController.processProductImages, setBodyMiddleware.setCreationDetails, productController.setSlug, productController.validateProduct, productController.createProduct)
    .get(productController.getProducts);
router
    .route('/:id')
    .patch(authMiddleware.protect, authMiddleware.restrictTo('super-admin', 'admin'), 
// authMiddleware.checkAccess,
validate_1.validateParams, productController.uploadUpdateProductImages, imageController.updateProductImage, setBodyMiddleware.setUpdateDetails, productController.setSlug, productController.updateProduct)
    .get(productController.getProduct)
    .delete(authMiddleware.protect, authMiddleware.restrictTo('super-admin', 'admin'), 
// authMiddleware.checkAccess,
validate_1.validateParams, productController.deleteProduct);
exports.default = router;

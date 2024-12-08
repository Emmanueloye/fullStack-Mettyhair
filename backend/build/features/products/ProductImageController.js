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
exports.updateProductImage = exports.processProductImages = void 0;
const utils = __importStar(require("../../utils"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const productModel_1 = __importDefault(require("./productModel"));
const processImage = (_a) => __awaiter(void 0, [_a], void 0, function* ({ image, width, height, format }) {
    // Create the filename
    const filename = `public/upload/${utils
        .generateToken({ type: 'plain' })
        .slice(0, 10)}.${format}`;
    // Process the image the file
    yield (0, sharp_1.default)(image).resize(width, height).toFormat(format).toFile(filename);
    return filename;
});
const processProductImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // Check if there is product image on files
    if ((_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.productImage) === null || _b === void 0 ? void 0 : _b.at(0)) {
        const filename = yield processImage({
            image: req.files.productImage[0].buffer,
            width: 800,
            height: 800,
            format: 'png',
        });
        // Save to cloudinary
        const resp = yield cloudinary_1.v2.uploader.upload(filename);
        // Delete the file from file system
        yield promises_1.default.unlink(filename);
        // Put the returned image link on request body.
        req.body.productImage = resp.secure_url;
        req.body.productImagePublicId = resp.public_id;
    }
    if ((_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.thumbnails) === null || _d === void 0 ? void 0 : _d.at(0)) {
        req.body.thumbnails = [];
        req.body.thumbnailsPublicId = [];
        for (const image of req.files.thumbnails) {
            const filename = yield processImage({
                image: image.buffer,
                width: 800,
                height: 800,
                format: 'png',
            });
            const resp = yield cloudinary_1.v2.uploader.upload(filename);
            // Delete the file from file system
            yield promises_1.default.unlink(filename);
            req.body.thumbnails.push(resp.secure_url);
            req.body.thumbnailsPublicId.push(resp.public_id);
        }
    }
    next();
});
exports.processProductImages = processProductImages;
const updateProductImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const product = yield productModel_1.default.findById(req.params.id);
    // Check if there is product image on files
    if ((_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.productImage) === null || _b === void 0 ? void 0 : _b.at(0)) {
        const filename = yield processImage({
            image: req.files.productImage.at(0).buffer,
            width: 800,
            height: 800,
            format: 'png',
        });
        if (product === null || product === void 0 ? void 0 : product.productImagePublicId) {
            yield cloudinary_1.v2.uploader.destroy(product.productImagePublicId);
        }
        const resp = yield cloudinary_1.v2.uploader.upload(filename);
        yield promises_1.default.unlink(filename);
        req.body.productImage = resp.secure_url;
        req.body.productImagePublicId = resp.public_id;
    }
    req.body.thumbnails = product && [...product.thumbnails];
    req.body.thumbnailsPublicId = product && [...product.thumbnailsPublicId];
    if ((_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.thumbOne) === null || _d === void 0 ? void 0 : _d.at(0)) {
        const filename = yield processImage({
            image: req.files.thumbOne.at(0).buffer,
            width: 800,
            height: 800,
            format: 'png',
        });
        if (product === null || product === void 0 ? void 0 : product.thumbnailsPublicId) {
            yield cloudinary_1.v2.uploader.destroy(product.thumbnailsPublicId[0]);
        }
        const resp = yield cloudinary_1.v2.uploader.upload(filename);
        yield promises_1.default.unlink(filename);
        req.body.thumbnails[0] = resp.secure_url;
        req.body.thumbnailsPublicId[0] = resp.public_id;
    }
    if ((_f = (_e = req.files) === null || _e === void 0 ? void 0 : _e.thumbTwo) === null || _f === void 0 ? void 0 : _f.at(0)) {
        const filename = yield processImage({
            image: req.files.thumbTwo.at(0).buffer,
            width: 800,
            height: 800,
            format: 'png',
        });
        if (product === null || product === void 0 ? void 0 : product.thumbnailsPublicId) {
            yield cloudinary_1.v2.uploader.destroy(product.thumbnailsPublicId[1]);
        }
        const resp = yield cloudinary_1.v2.uploader.upload(filename);
        yield promises_1.default.unlink(filename);
        req.body.thumbnails[1] = resp.secure_url;
        req.body.thumbnailsPublicId[1] = resp.public_id;
    }
    next();
});
exports.updateProductImage = updateProductImage;

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
exports.processImage = exports.setSlug = exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getCategories = exports.createCategory = exports.uploadPhoto = void 0;
const factory = __importStar(require("../../utils/handlerFactory"));
const categoryModel_1 = __importDefault(require("./categoryModel"));
const utils = __importStar(require("../../utils"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
// To upload user image using multer.
exports.uploadPhoto = utils.upload.single('photo');
exports.createCategory = factory.createOne({
    Model: categoryModel_1.default,
    label: 'category',
    includedFields: ['category', 'photo', 'createdAt', 'createdBy'],
});
exports.getCategories = factory.getAll({
    Model: categoryModel_1.default,
    label: 'categories',
});
exports.getCategory = factory.getOne({
    Model: categoryModel_1.default,
    label: 'category',
});
exports.updateCategory = factory.updateOne({
    Model: categoryModel_1.default,
    label: 'category',
});
exports.deleteCategory = factory.deleteOne({
    Model: categoryModel_1.default,
    label: 'category',
});
const setSlug = (req, res, next) => {
    if (req.body.category && !req.body.slug)
        req.body.slug = utils.slugifyInput(req.body.category);
    next();
};
exports.setSlug = setSlug;
// Process category image
const processImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentCategory = yield categoryModel_1.default.findById(req.params.id);
    // If user does not update image, move on to the next middleware.
    if (!req.file)
        return next();
    //   Put the file path on the body
    const fileName = `${req.file.originalname.split('.').at(0)}.png`;
    yield (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .toFile(`public/upload/${fileName}`);
    if (currentCategory === null || currentCategory === void 0 ? void 0 : currentCategory.photoPublicId) {
        yield cloudinary_1.v2.uploader.destroy(currentCategory.photoPublicId);
    }
    const resp = yield cloudinary_1.v2.uploader.upload(`public/upload/${fileName}`);
    yield promises_1.default.unlink(`public/upload/${fileName}`);
    req.body.photo = resp.secure_url;
    req.body.photoPublicId = resp.public_id;
    next();
});
exports.processImage = processImage;

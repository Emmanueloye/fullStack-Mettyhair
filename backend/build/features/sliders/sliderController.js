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
exports.processImage = exports.uploadSlider = exports.setUpdateData = exports.setCreationData = exports.deleteSlider = exports.updateSlider = exports.getSlider = exports.getSliders = exports.createSlider = void 0;
const sliderModel_1 = __importDefault(require("./sliderModel"));
const factory = __importStar(require("../../utils/handlerFactory"));
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const utils = __importStar(require("../../utils"));
const AppError = __importStar(require("../../errors/appError"));
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
exports.createSlider = factory.createOne({
    Model: sliderModel_1.default,
    label: 'slider',
    includedFields: ['title', 'description', 'image', 'createdAt', 'createdBy'],
});
exports.getSliders = factory.getAll({ Model: sliderModel_1.default, label: 'sliders' });
exports.getSlider = factory.getOne({ Model: sliderModel_1.default, label: 'slider' });
exports.updateSlider = factory.updateOne({
    Model: sliderModel_1.default,
    label: 'slider',
});
const deleteSlider = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slider = yield sliderModel_1.default.findById(req.params.id);
    if (!slider) {
        throw new AppError.NotFoundError('We could not find the slider you want to delete.');
    }
    if (slider.imagePublicId) {
        yield cloudinary_1.v2.uploader.destroy(slider.imagePublicId);
    }
    yield slider.deleteOne();
    res.status(statusCodes_1.default.NO_CONTENT).json({ status: 'success' });
});
exports.deleteSlider = deleteSlider;
// set created at and created by on req.body
const setCreationData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.body.createdBy)
        req.body.createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    next();
});
exports.setCreationData = setCreationData;
// set updated at and updated by on req.body
const setUpdateData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.body.updatedAt)
        req.body.updatedAt = Date.now();
    if (!req.body.updatedBy)
        req.body.updatedBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    next();
});
exports.setUpdateData = setUpdateData;
// To upload slider image
exports.uploadSlider = utils.upload.single('image');
// slider image processing.
const processImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentSlider = yield sliderModel_1.default.findById(req.params.id);
    if (!req.file)
        return next();
    const fileName = `${req.file.originalname.split('.').at(0)}.png`;
    yield (0, sharp_1.default)(req.file.buffer)
        .resize(500, 500)
        .toFormat('png')
        .toFile(`public/upload/${fileName}`);
    if (currentSlider === null || currentSlider === void 0 ? void 0 : currentSlider.imagePublicId) {
        yield cloudinary_1.v2.uploader.destroy(currentSlider.imagePublicId);
    }
    const resp = yield cloudinary_1.v2.uploader.upload(`public/upload/${fileName}`);
    yield promises_1.default.unlink(`public/upload/${fileName}`);
    req.body.image = resp.secure_url;
    req.body.imagePublicId = resp.public_id;
    next();
});
exports.processImage = processImage;

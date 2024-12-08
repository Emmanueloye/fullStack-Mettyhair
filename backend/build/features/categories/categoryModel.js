"use strict";
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
const mongoose_1 = require("mongoose");
const subCatModel_1 = __importDefault(require("../subcategories/subCatModel"));
const categorySchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: [true, 'Category field is required.'],
        lowercase: true,
        unique: true,
    },
    slug: String,
    photo: {
        type: String,
    },
    photoPublicId: String,
    createdAt: Date,
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedAt: Date,
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
});
categorySchema.pre(/^find/, function () {
    this.populate({ path: 'createdBy', select: 'fullName' }).populate({
        path: 'updatedBy',
        select: 'fullName',
    });
});
categorySchema.pre('deleteOne', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedDoc = yield this.model.findOne(this.getFilter());
        if (deletedDoc) {
            yield subCatModel_1.default.deleteMany({ category: deletedDoc._id });
        }
    });
});
exports.default = (0, mongoose_1.model)('Category', categorySchema);

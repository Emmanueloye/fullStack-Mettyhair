"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subCategorySchema = new mongoose_1.Schema({
    subcategory: {
        type: String,
        required: [true, 'Subcategory field is required.'],
        unique: true,
        lowercase: true,
    },
    slug: String,
    category: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Category',
    },
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
    isActive: {
        type: Boolean,
        default: true,
    },
});
subCategorySchema.pre(/^find/, function () {
    this.populate({ path: 'category', select: 'category' })
        .populate({
        path: 'createdBy',
        select: 'fullName',
    })
        .populate({ path: 'updatedBy', select: 'fullName' });
});
exports.default = (0, mongoose_1.model)('Subcategory', subCategorySchema);

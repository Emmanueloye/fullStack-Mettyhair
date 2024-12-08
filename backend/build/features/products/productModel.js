"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: [true, 'Product field is required.'],
        trim: true,
        lowercase: true,
        unique: true,
    },
    slug: String,
    category: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category field is required'],
    },
    subcategory: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Subcategory',
        required: [true, 'Subcategory field is required'],
    },
    quantity: {
        type: Number,
        required: ['true', 'Quantity field is required.'],
    },
    sellingPrice: {
        type: Number,
        required: ['true', 'Selling price field is required.'],
    },
    discountPrice: {
        type: Number,
        // required: ['true', 'Discount price field is required.'],
        // validate: {
        //   validator: function (this: any, discount: number) {
        //     return discount < this.sellingPrice;
        //   },
        //   message: 'Discount price must be less than selling price.',
        // },
    },
    costPrice: {
        type: Number,
        required: ['true', 'Cost price field is required.'],
        // validate: {
        //   validator: function (this: any, cost: number) {
        //     if (this.discountPrice) return cost < this.discountPrice;
        //     return cost < this.sellingPrice;
        //   },
        //   message: 'Cost price is higher than selling or discount price.',
        // },
    },
    color: String,
    size: String,
    appearance: String,
    productImage: {
        type: String,
        required: [true, 'Product image field is required.'],
    },
    productImagePublicId: String,
    thumbnails: {
        type: [String],
        required: [true, 'Product thumbnails field is required.'],
        validate: {
            validator: function (inputtedThumbnails) {
                return inputtedThumbnails.length === 2;
            },
            message: 'Product thumbnails accepts only two images.',
        },
    },
    thumbnailsPublicId: [String],
    shortDesc: {
        type: String,
        required: [true, 'Short description field is required.'],
    },
    description: {
        type: String,
        required: [true, 'Long description field is required.'],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    numOfReview: Number,
    averageRating: Number,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
    },
    updatedAt: Date,
    updatedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
productSchema.virtual('reviews', {
    localField: '_id',
    foreignField: 'product',
    ref: 'Review',
});
productSchema.pre(/^find/, function () {
    this.populate({ path: 'category', select: 'category' })
        .populate({
        path: 'subcategory',
        select: 'subcategory',
    })
        .populate({ path: 'createdBy', select: 'fullName' })
        .populate({ path: 'updatedBy', select: 'fullName' });
});
exports.default = (0, mongoose_1.model)('Product', productSchema);

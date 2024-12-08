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
const productModel_1 = __importDefault(require("../products/productModel"));
const reviewSchema = new mongoose_1.Schema({
    rating: {
        type: Number,
        required: [true, 'Rating field is required.'],
        min: [1, 'Rating must be at least one (1).'],
        max: [5, 'Rating cannot be more than five (5).'],
    },
    review: {
        type: String,
        required: [true, 'Review field is required.'],
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    approvedDate: Date,
    isRejected: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
// Calculate number of review and average rating and save it in product collection.
reviewSchema.statics.calcReviewMetrics = function (productId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const metrics = yield this.aggregate([
            { $match: { product: productId } },
            {
                $group: {
                    _id: '$product',
                    numOfReview: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                },
            },
        ]);
        yield productModel_1.default.findByIdAndUpdate(productId, {
            numOfReview: ((_a = metrics === null || metrics === void 0 ? void 0 : metrics.at(0)) === null || _a === void 0 ? void 0 : _a.numOfReview) || 0,
            averageRating: Math.round((_b = metrics === null || metrics === void 0 ? void 0 : metrics.at(0)) === null || _b === void 0 ? void 0 : _b.averageRating) || 0,
        }, { new: true });
    });
};
// Update the calculation on create/save
reviewSchema.post('save', function () {
    const model = this.constructor;
    model.calcReviewMetrics(this.product);
});
// Update the calculation on update.
reviewSchema.pre('findOneAndUpdate', function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the currently updated document and pass it to the post middleware.
        this.review = yield this.model.findOne(this.getQuery());
    });
});
reviewSchema.post('findOneAndUpdate', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.review.constructor.calcReviewMetrics(this.review.product);
    });
});
// Update the calculation on delete
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
    const model = this.constructor;
    model.calcReviewMetrics(this.product);
});
reviewSchema.pre(/^find/, function () {
    this.populate({ path: 'user', select: 'fullName photo email' }).populate({
        path: 'approvedBy',
        select: 'fullName',
    });
});
exports.default = (0, mongoose_1.model)('Review', reviewSchema);

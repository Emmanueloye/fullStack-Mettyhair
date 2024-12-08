"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    cartId: String,
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        min: [1, 'Quantity must be at least one.'],
    },
    color: String,
    size: String,
}, { timestamps: true });
cartSchema.pre(/^find/, function () {
    this.populate({
        path: 'product',
        select: 'productName productImage sellingPrice discountPrice quantity slug costPrice',
    });
});
exports.default = (0, mongoose_1.model)('Cart', cartSchema);

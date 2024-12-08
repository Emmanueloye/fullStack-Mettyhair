"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderItemsSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
    },
    orderNo: {
        type: String,
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    sellingPrice: {
        type: Number,
    },
    discountPrice: {
        type: Number,
    },
    costPrice: Number,
    price: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
orderItemsSchema.pre(/^find/, function () {
    this.populate({ path: 'productId', select: 'productName productImage' });
});
exports.default = (0, mongoose_1.model)('OrderItems', orderItemsSchema);

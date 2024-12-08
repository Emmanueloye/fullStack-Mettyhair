"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    orderNo: {
        type: String,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    orderName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    transactionId: {
        type: String,
        required: true,
    },
    invoiceNo: {
        type: String,
        required: true,
    },
    reference: String,
    charges: Number,
    cardType: String,
    bank: String,
    currency: String,
    paymentDate: Date,
    orderStatus: {
        type: String,
        default: 'pending',
        enum: {
            values: ['pending', 'confirmed', 'delivered', 'cancelled'],
            message: 'Invalid order status',
        },
    },
    address: String,
    phone: String,
    state: String,
    country: String,
    note: String,
    confirmationDate: Date,
    confirmedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    deliveryDate: Date,
    deliveredBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    postedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    isManuel: {
        type: Boolean,
        default: false,
    },
});
orderSchema.pre(/^find/, function () {
    this.populate({ path: 'user', select: 'email' })
        .populate({
        path: 'confirmedBy',
        select: 'fullName',
    })
        .populate({ path: 'deliveredBy', select: 'fullName' });
});
exports.default = (0, mongoose_1.model)('Order', orderSchema);

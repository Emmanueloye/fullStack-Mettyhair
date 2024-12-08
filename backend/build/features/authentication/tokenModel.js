"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isValid: {
        type: Boolean,
        default: true,
        required: true,
    },
    userIP: {
        type: String,
    },
    userAgent: {
        type: String,
        required: true,
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.default = (0, mongoose_1.model)('Token', tokenSchema);

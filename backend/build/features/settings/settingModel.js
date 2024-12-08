"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const settingSchema = new mongoose_1.Schema({
    facebook: {
        type: String,
        required: [true, 'Business facebook link is required.'],
    },
    instagram: {
        type: String,
        required: [true, 'Business instagram link is required.'],
    },
    thread: String,
    twitter: String,
    reorderLevel: {
        type: Number,
        required: [true, 'Inventory re-order level field is required.'],
    },
    contactPhone: {
        type: String,
        required: [true, 'Business contact phone is required.'],
    },
    contactEmail: {
        type: String,
        required: [true, 'Business contact email is required.'],
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Setting', settingSchema);

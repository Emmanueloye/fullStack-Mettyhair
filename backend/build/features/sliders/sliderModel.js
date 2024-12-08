"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sliderSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Slider title field is required'],
    },
    description: {
        type: String,
        required: [true, 'Slider description field is required.'],
    },
    image: {
        type: String,
        required: [true, 'Slider image field is required'],
    },
    imagePublicId: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    isActive: {
        type: Boolean,
        default: false,
    },
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
sliderSchema.pre(/^find/, function () {
    this.populate({ path: 'createdBy', select: 'fullName' }).populate({
        path: 'updatedBy',
        select: 'fullName',
    });
});
exports.default = (0, mongoose_1.model)('Slider', sliderSchema);

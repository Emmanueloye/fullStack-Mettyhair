"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accessSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
    },
    permittedRoutes: {
        type: [String],
    },
});
exports.default = (0, mongoose_1.model)('AccessDb', accessSchema);

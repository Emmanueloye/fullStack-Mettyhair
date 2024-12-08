"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
// Handles all uncaught expections
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION');
    console.error(`${err.name}: ${err.message}`);
});
// import app to create server
const app_1 = __importDefault(require("./app"));
// set up database connection
mongoose_1.default
    .connect(process.env.DATABASE_URI)
    .then(() => console.log(`Database connected...`));
// set up the application server
const port = process.env.PORT || 3000;
const server = app_1.default.listen(port, () => console.log(`Server listening on port:${port}`));
// Handle all unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION ⚠⚠⚠');
    console.error(`${err.name}: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

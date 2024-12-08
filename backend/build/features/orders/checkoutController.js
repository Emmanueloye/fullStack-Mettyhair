"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.validateCheckout = exports.paymentConfirmation = exports.verifyCheckout = exports.checkout = void 0;
const validate_1 = require("../../utils/validate");
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const checkoutService = __importStar(require("./checkoutService"));
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield checkoutService.initializeCheckout(req, res);
});
exports.checkout = checkout;
const verifyCheckout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // In the dashboard, under webhook url, put the path that matches the back end path.
    // Based on the initialization request, an event is emitted back to the server which is handled in verify checkout handler.
    let eventData;
    const hash = crypto_1.default
        .createHmac('sha512', `${process.env.PAYSTACK_SECRET_KEY}`)
        .update(JSON.stringify(req.body))
        .digest('hex');
    if (hash === req.headers['x-paystack-signature']) {
        eventData = req.body;
    }
    const data = eventData.data;
    yield checkoutService.verifyTransaction(data, eventData, res);
});
exports.verifyCheckout = verifyCheckout;
const paymentConfirmation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield checkoutService.checkoutConfirmation(req);
    res.status(200).json({ status: 'success', order });
});
exports.paymentConfirmation = paymentConfirmation;
// Validation
exports.validateCheckout = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('Full name field is required.'),
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email field is required.'),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone field is required.'),
    (0, express_validator_1.body)('address').notEmpty().withMessage('Address field is required.'),
    (0, express_validator_1.body)('state').notEmpty().withMessage('State field is required.'),
    (0, express_validator_1.body)('country').notEmpty().withMessage('Country field is required.'),
]);

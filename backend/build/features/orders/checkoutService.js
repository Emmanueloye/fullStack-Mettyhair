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
exports.checkoutConfirmation = exports.verifyTransaction = exports.initializeCheckout = void 0;
const orderModel_1 = __importDefault(require("./orderModel"));
const orderItemsModel_1 = __importDefault(require("./orderItemsModel"));
const productModel_1 = __importDefault(require("../products/productModel"));
const cartModel_1 = __importDefault(require("../carts/cartModel"));
const util = __importStar(require("../../utils"));
const axios_1 = __importDefault(require("axios"));
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
const mongoose_1 = require("mongoose");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const AppError = __importStar(require("../../errors/appError"));
const initializeCheckout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all cart items for the currently logged in user.
    const carts = yield cartModel_1.default.find({ user: req.user.id });
    // Calculate subtotal and total discount.
    const { subtotal, totalDiscount } = util.calcCartTotal(carts);
    // Specify checkout data
    const checkoutData = {
        email: req.body.email,
        amount: (subtotal - totalDiscount) * 100,
        callback_url: process.env.PAYSTACK_cALLBACK_URL,
        metadata: {
            orderName: req.body.fullName,
            customerName: req.user.fullName,
            user: req.user.id,
            phone: req.body.phone,
            state: req.body.state,
            country: req.body.country,
            subtotal,
            discount: totalDiscount,
            note: req.body.note,
            address: req.body.address,
        },
    };
    // Send a post request to paystack transaction/initialize api endpoint.
    try {
        const resp = yield axios_1.default.post('https://api.paystack.co/transaction/initialize', checkoutData, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        // Destructure the required data from the response received from the api.
        const { authorization_url, access_code, reference } = resp.data.data;
        // Send back to the user
        res.status(statusCodes_1.default.OK).json({
            status: 'success',
            checkout: { authorization_url, access_code, reference },
        });
    }
    catch (error) {
        res.status(statusCodes_1.default.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Something went wrong. Please try again later.',
        });
    }
});
exports.initializeCheckout = initializeCheckout;
const verifyTransaction = (data, eventData, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.status === 'success' && eventData.event === 'charge.success') {
            const uid = new short_unique_id_1.default({ length: 8 });
            const orderNumber = uid.rnd();
            const session = yield (0, mongoose_1.startSession)();
            yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
                // Create new order.
                const newOrder = yield orderModel_1.default.create({
                    orderNo: orderNumber,
                    subtotal: data.metadata.subtotal,
                    discount: data.metadata.discount,
                    totalAmount: data.amount / 100,
                    customerName: data.metadata.customerName,
                    orderName: data.metadata.orderName,
                    user: data.metadata.user,
                    transactionId: data.id,
                    invoiceNo: Math.floor(data.id / 2),
                    reference: data.reference,
                    charges: data.fees / 100,
                    cardType: data.authorization.cardType,
                    currency: data.currency,
                    paymentDate: data.paid_at,
                    address: data.metadata.address,
                    phone: data.metadata.phone,
                    state: data.metadata.state,
                    country: data.metadata.country,
                    note: data.metadata.note,
                });
                // Get cart items.
                const carts = yield cartModel_1.default.find({
                    user: data.metadata.user,
                });
                // Loop through the cart and save cart items into order items.
                for (let cart of carts) {
                    // Get the product from cart
                    const product = yield productModel_1.default.findOne({ _id: cart.product._id });
                    // Save cart item into order item collection.
                    yield orderItemsModel_1.default.create({
                        orderId: newOrder._id,
                        orderNo: orderNumber,
                        productId: cart.product,
                        color: cart.color,
                        quantity: cart.quantity,
                        sellingPrice: cart.product.sellingPrice,
                        discountPrice: cart.product.discountPrice,
                        costPrice: cart.product.costPrice,
                        price: cart.product.discountPrice
                            ? cart.product.discountPrice
                            : cart.product.sellingPrice,
                        createdAt: Date.now(),
                    });
                    // If product and quantity exist, back out the sales from the existing product quantity.
                    if (product && product.quantity) {
                        product.quantity -= cart.quantity;
                        yield product.save();
                    }
                    // Delete cart item.
                    yield cart.deleteOne();
                }
            }));
            yield session.endSession();
            res.status(200).json({ status: 'success' });
        }
        else {
            res.status(400).json({ status: 'failed' });
        }
    }
    catch (error) {
        res.status(400).json({ status: 'Something went wrong. try again later.' });
    }
});
exports.verifyTransaction = verifyTransaction;
const checkoutConfirmation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findOne({ reference: req.query.reference });
    if (!order)
        throw new AppError.NotFoundError(`We could not find order resource you are looking for.`);
    return order;
});
exports.checkoutConfirmation = checkoutConfirmation;

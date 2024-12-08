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
exports.setOrderUpdate = exports.returnOrder = exports.updateOrder = exports.getAllOrders = exports.getOrder = exports.getUserOrder = void 0;
const orderModel_1 = __importDefault(require("./orderModel"));
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
const orderService = __importStar(require("./orderService"));
const factory = __importStar(require("../../utils/handlerFactory"));
// For currently logged in user.
const getUserOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, orders } = yield orderService.getCurrentUserOrders(req);
    res
        .status(statusCodes_1.default.OK)
        .json({ status: 'success', noHits: orders.length, page, orders });
});
exports.getUserOrder = getUserOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order, orderItems } = yield orderService.getSingleOrder(req);
    res.status(statusCodes_1.default.OK).json({ status: 'success', order, orderItems });
});
exports.getOrder = getOrder;
// For Admin only.
exports.getAllOrders = factory.getAll({ Model: orderModel_1.default, label: 'orders' });
exports.updateOrder = factory.updateOne({
    Model: orderModel_1.default,
    label: 'order',
    includedFields: [
        'orderStatus',
        'confirmationDate',
        'confirmedBy',
        'deliveryDate',
        'deliveredBy',
    ],
});
const returnOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.returnOrder = returnOrder;
const setOrderUpdate = (req, res, next) => {
    if (req.body.orderStatus === 'confirmed') {
        req.body.confirmationDate = Date.now();
        req.body.confirmedBy = req.user.id;
    }
    if (req.body.orderStatus === 'delivered') {
        req.body.deliveryDate = Date.now();
        req.body.deliveredBy = req.user.id;
    }
    next();
};
exports.setOrderUpdate = setOrderUpdate;

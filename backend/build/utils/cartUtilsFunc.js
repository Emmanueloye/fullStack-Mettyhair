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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcCartTotal = exports.updateCartQuery = exports.mergeCartItems = void 0;
const utils = __importStar(require("../utils"));
const mergeCartItems = (Model, carts) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueCarts = new Map();
    for (const cart of carts) {
        const cartId = cart.product.toString();
        if (!uniqueCarts.has(cartId)) {
            uniqueCarts.set(cartId, cart);
        }
        else {
            yield Model.findOneAndDelete(cart._id);
        }
    }
    return [...uniqueCarts.values()];
});
exports.mergeCartItems = mergeCartItems;
const updateCartQuery = (req, Cart) => __awaiter(void 0, void 0, void 0, function* () {
    let filterObj = {};
    // If user is signed in, get the cart with cartId and update with user info
    if (req.signedCookies.refreshToken) {
        // Get carts with cartids
        const cartWithIds = yield Cart.find({ cartId: req.headers.cartid });
        // Get the user id from the token
        const decode = yield utils.verifyJWT(req.signedCookies.refreshToken);
        const user = decode.payload.token;
        filterObj = { user };
        // Replace cartids with userid
        if (cartWithIds) {
            for (const cartItem of cartWithIds) {
                cartItem.user = user;
                cartItem.cartId = undefined;
                yield cartItem.save();
            }
        }
    }
    // If the user is not signed in, we use cartid coming from request headers
    if (!req.signedCookies.refreshToken) {
        filterObj = { cartId: req.headers.cartid };
    }
    return filterObj;
});
exports.updateCartQuery = updateCartQuery;
const calcCartTotal = (carts) => {
    return carts.reduce((acc, cart) => {
        const discountPerUnit = cart.product.discountPrice
            ? cart.product.sellingPrice - cart.product.discountPrice
            : 0;
        const subtotal = (acc.subtotal +=
            cart.product.sellingPrice * cart.quantity);
        const totalDiscount = (acc.totalDiscount +=
            discountPerUnit * cart.quantity);
        return { subtotal, totalDiscount };
    }, { subtotal: 0, totalDiscount: 0 });
};
exports.calcCartTotal = calcCartTotal;

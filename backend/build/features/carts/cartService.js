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
exports.getUserCarts = exports.AddProductToCart = void 0;
const cartModel_1 = __importDefault(require("./cartModel"));
const utils = __importStar(require("../../utils"));
const statusCodes_1 = __importDefault(require("../../errors/statusCodes"));
const AppError = __importStar(require("../../errors/appError"));
const AddProductToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { product, quantity, color, size, cartId } = req.body;
    const { refreshToken } = req.signedCookies;
    let filterObj;
    // if user is logged in, get existing cart using the login user and product id.
    if (refreshToken) {
        const decode = yield utils.verifyJWT(refreshToken);
        req.body.user = decode.payload.token;
        filterObj = { user: req.body.user, product };
    }
    // if user not logged in, get existing cart using cart id managed on frontend.
    if (!refreshToken) {
        req.body.cartId = cartId ? cartId : utils.generateToken({ type: 'plain' });
        filterObj = { cartId: req.body.cartId, product };
    }
    const existingCart = yield cartModel_1.default.findOne(filterObj);
    if (!existingCart) {
        const newCart = yield cartModel_1.default.create({
            user: (_a = req.body) === null || _a === void 0 ? void 0 : _a.user,
            cartId: (_b = req.body) === null || _b === void 0 ? void 0 : _b.cartId,
            product,
            quantity,
            color,
            size,
        });
        const cartId = newCart.cartId;
        res
            .status(statusCodes_1.default.CREATED)
            .json({ status: 'success', cartId, message: 'Product added to cart.' });
        return;
    }
    if (existingCart) {
        if ((existingCart === null || existingCart === void 0 ? void 0 : existingCart.quantity) !== +quantity ||
            (existingCart === null || existingCart === void 0 ? void 0 : existingCart.color) !== color ||
            (existingCart === null || existingCart === void 0 ? void 0 : existingCart.size) !== size) {
            // update existing cart item
            existingCart.quantity = quantity;
            existingCart.color = color;
            existingCart.size = size;
            yield existingCart.save();
        }
        else {
            throw new AppError.BadRequestError('Product already in cart.');
        }
        res
            .status(statusCodes_1.default.OK)
            .json({ status: 'success', message: 'Your cart has been updated.' });
        return;
    }
});
exports.AddProductToCart = AddProductToCart;
const getUserCarts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Update cartid with logged in user if it's available.
    let filterObj = yield utils.updateCartQuery(req, cartModel_1.default);
    const getFeatures = new utils.GetRequestAPI(cartModel_1.default.find(filterObj), req.query)
        .filter()
        .sort()
        .limitDocuments()
        .limitFields()
        .paginate();
    const carts = yield getFeatures.query;
    const updatedCarts = yield utils.mergeCartItems(cartModel_1.default, carts);
    // const documentCount = await Cart.find().countDocuments();
    // let page;
    // if (req.query.page) page = utils.paginateDetails(documentCount, req);
    res.status(statusCodes_1.default.OK).json({
        status: 'success',
        noHits: updatedCarts.length,
        // page,
        carts: updatedCarts,
    });
});
exports.getUserCarts = getUserCarts;

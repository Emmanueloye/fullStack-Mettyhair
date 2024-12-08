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
exports.logoutToken = exports.sendCookies = exports.verifyJWT = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError = __importStar(require("../errors/appError"));
const createJWT = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
};
exports.createJWT = createJWT;
const verifyJWT = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        throw new AppError.UnAuthenticatedError('Invalid tokens credentials.');
    }
});
exports.verifyJWT = verifyJWT;
const sendCookies = ({ res, token, refresh }) => {
    // Create the JWT tokens
    const accessToken = (0, exports.createJWT)({ payload: { token } });
    const refreshToken = (0, exports.createJWT)({ payload: { token, refresh } });
    //   Send the cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * Number(process.env.ACCESS_TOKEN_EXPIRES),
        secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_EXPIRES),
        secure: process.env.NODE_ENV === 'production',
    });
};
exports.sendCookies = sendCookies;
// send empty token for logout
const logoutToken = (res) => {
    res.cookie('accessToken', '', {
        httpOnly: true,
        maxAge: 1,
        secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        maxAge: 1,
        secure: process.env.NODE_ENV === 'production',
    });
};
exports.logoutToken = logoutToken;

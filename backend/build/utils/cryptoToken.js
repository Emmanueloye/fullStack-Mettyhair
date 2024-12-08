"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashCryptoToken = exports.createCryptoToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const createCryptoToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.createCryptoToken = createCryptoToken;
const hashCryptoToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
exports.hashCryptoToken = hashCryptoToken;
// To generate both plain and hashed token, call the function with empty object like this: generateToken({})
const generateToken = ({ type, token }) => {
    if (type === 'plain') {
        return (0, exports.createCryptoToken)();
    }
    if (type === 'hash' && token) {
        return (0, exports.hashCryptoToken)(token);
    }
    const newToken = (0, exports.createCryptoToken)();
    const newHashedToken = (0, exports.hashCryptoToken)(newToken);
    return [newToken, newHashedToken];
};
exports.default = generateToken;

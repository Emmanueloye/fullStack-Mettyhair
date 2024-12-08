"use strict";
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
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name field is required.'],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email field is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.default.isEmail, 'Email must be a valid email address.'],
    },
    emailVerificationToken: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifiedDate: Date,
    password: {
        type: String,
        required: [true, 'Password field is required.'],
        trim: true,
        select: false,
        minlength: [5, 'Password must be at least 5 characters.'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirmed password field is required.'],
        trim: true,
        validate: {
            validator: function (savedPassword) {
                return this.password === savedPassword;
            },
            message: 'Password and confirm  password must match.',
        },
    },
    passwordResetToken: String,
    passwordTokenExpiresAt: Date,
    passwordChangedAt: Date,
    photo: String,
    photoPublicId: String,
    role: {
        type: String,
        enum: {
            values: ['user', 'super-admin', 'admin', 'wholeseller'],
            message: '{VALUE} is not valid.',
        },
        default: 'user',
    },
    address: String,
    state: String,
    country: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
// userSchema.virtual('token', {
//   localField: '_id',
//   foreignField: 'userId',
//   ref: 'Token',
// });
// Hash the password before saving it to database and set confirmed password to empty string.
userSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        // If password is not modified, return
        if (!this.isModified('password'))
            return;
        // Otherwise, hash the password
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        // set confirmed password to empty string.
        this.confirmPassword = '';
    });
});
userSchema.methods.isPasswordCorrect = function (userPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(userPassword, savedPassword);
    });
};
userSchema.methods.detectPasswordChange = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(`${this.passwordChangedAt.getTime() / 1000}`, 10);
        return changedTimestamp > JWTTimeStamp;
    }
    return false;
};
userSchema.virtual('access', {
    localField: '_id',
    foreignField: 'userId',
    ref: 'AccessDb',
});
exports.default = (0, mongoose_1.model)('User', userSchema);

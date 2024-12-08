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
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const html_to_text_1 = require("html-to-text");
const path_1 = __importDefault(require("path"));
class Email {
    constructor() { }
    transporter() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer_1.default.createTransport({
                host: process.env.BREVO_HOST,
                port: Number(process.env.BREVO_PORT),
                auth: {
                    user: process.env.BREVO_LOGIN,
                    pass: process.env.BREVO_KEY,
                },
            });
        }
        return nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    //  `${__dirname}/../view/emails/${template}.ejs`
    // ../../src/view/emails
    send(template, subject, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Code will be in build folder in production which excludes the ejs files.
            const filepath = process.env.NODE_ENV === 'production'
                ? path_1.default.resolve(__dirname, `../../src/view/emails/${template}.ejs`)
                : path_1.default.resolve(__dirname, `../view/emails/${template}.ejs`);
            ejs_1.default.renderFile(filepath, Object.assign({}, data), (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    const mailOptions = {
                        from: process.env.NODE_ENV === 'development'
                            ? process.env.EMAIL_SENDER
                            : process.env.SENDER_EMAIL,
                        to: data.email,
                        subject,
                        html: result,
                        text: (0, html_to_text_1.convert)(result),
                    };
                    return this.transporter().sendMail(mailOptions);
                }
            });
        });
    }
    sendVerificationEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('emailVerification', 'Email Verification', data);
        });
    }
    sendPasswordResetEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('passwordResetEmail', 'Password Reset: expires in 20 minutes', data);
        });
    }
    sendAdminEmailVerification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.send('adminEmailVerification', 'You have being made an Admin of Mettyhair', data);
        });
    }
}
exports.default = new Email();

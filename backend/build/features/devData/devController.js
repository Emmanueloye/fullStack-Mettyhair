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
exports.deleteDevData = exports.uploadDevData = void 0;
const productModel_1 = __importDefault(require("../products/productModel"));
const reviewModel_1 = __importDefault(require("../reviews/reviewModel"));
const fs_1 = __importDefault(require("fs"));
const uploadDevData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProducts = JSON.parse(fs_1.default.readFileSync(`${__dirname}/newProducts.json`, 'utf-8'));
        yield productModel_1.default.create(newProducts);
        console.log('data loaded successfull');
        res.send('data loaded successfull');
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
});
exports.uploadDevData = uploadDevData;
const deleteDevData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productModel_1.default.deleteMany();
        yield reviewModel_1.default.deleteMany();
        console.log('data deleted successfull');
        res.send('data deleted successfull');
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
});
exports.deleteDevData = deleteDevData;

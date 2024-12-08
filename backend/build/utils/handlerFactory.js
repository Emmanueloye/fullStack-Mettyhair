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
exports.deleteOne = exports.updateOne = exports.getOne = exports.getAll = exports.createOne = void 0;
const statusCodes_1 = __importDefault(require("../errors/statusCodes"));
const AppError = __importStar(require("../errors/appError"));
const utils = __importStar(require("../utils"));
const getRequestAPI_1 = __importStar(require("./getRequestAPI"));
// baseUrl: '/api/v1/users',
//   originalUrl: '/api/v1/users/me'
const createOne = ({ Model, label, includedFields, excludedFields, }) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const filteredObj = utils.fieldFilter({
            req,
            includedFields,
            excludedFields,
        });
        const newDoc = yield Model.create(filteredObj);
        res.status(statusCodes_1.default.CREATED).json({
            status: 'success',
            [label]: newDoc,
            message: `${label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()} created successfully.`,
        });
    });
};
exports.createOne = createOne;
const getAll = ({ Model, label }) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Hack to get reviews on product - for nested get request on review
        let filterObj = {};
        if (req.params.productid)
            filterObj = { product: req.params.productId };
        const getFeatures = new getRequestAPI_1.default(Model.find(filterObj), req.query)
            .filter()
            .sort()
            .limitFields()
            .limitDocuments()
            .paginate();
        const docs = yield getFeatures.query;
        // To get the document count using the incoming query except for pagination and limit.
        const queryReq = new getRequestAPI_1.default(Model.find(filterObj), req.query)
            .filter()
            .sort()
            .limitFields();
        const documentCount = yield queryReq.query.countDocuments();
        let page;
        if (req.query.page)
            page = (0, getRequestAPI_1.paginateDetails)(documentCount, req);
        res
            .status(statusCodes_1.default.OK)
            .json({ status: 'success', noHits: docs.length, page, [label]: docs });
    });
};
exports.getAll = getAll;
const getOne = ({ Model, label, populateOption }) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let query = Model.findById(req.params.id);
        if (populateOption) {
            query = query.populate(populateOption);
        }
        const doc = yield query;
        if (!doc) {
            throw new AppError.NotFoundError(`We could not find ${label} resource you are looking for.`);
        }
        res.status(statusCodes_1.default.OK).json({ status: 'success', [label]: doc });
    });
};
exports.getOne = getOne;
const updateOne = ({ Model, label, includedFields, excludedFields, }) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const filteredObj = utils.fieldFilter({
            req,
            includedFields,
            excludedFields,
        });
        const doc = yield Model.findByIdAndUpdate(req.params.id, filteredObj, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            throw new AppError.NotFoundError(`We could not find ${label} resource you are looking for.`);
        }
        res.status(statusCodes_1.default.OK).json({
            status: 'success',
            message: `${label.charAt(0).toUpperCase() + label.slice(1)} updated successfully.`,
            [label]: doc,
        });
    });
};
exports.updateOne = updateOne;
const deleteOne = ({ Model, label }) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const doc = yield Model.findById(req.params.id);
        if (!doc) {
            throw new AppError.NotFoundError(`We could not find the ${label} resource you are looking for.`);
        }
        yield doc.deleteOne();
        res.status(statusCodes_1.default.NO_CONTENT).json({ status: 'success' });
    });
};
exports.deleteOne = deleteOne;

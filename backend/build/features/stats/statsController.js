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
exports.dashboardMetrics = void 0;
const productModel_1 = __importDefault(require("../products/productModel"));
const orderModel_1 = __importDefault(require("../orders/orderModel"));
const orderItemsModel_1 = __importDefault(require("../orders/orderItemsModel"));
const settingModel_1 = __importDefault(require("../settings/settingModel"));
const userModel_1 = __importDefault(require("../authentication/userModel"));
const dayjs_1 = __importDefault(require("dayjs"));
const dashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const settings = yield settingModel_1.default.find();
    const products = yield productModel_1.default.find({
        quantity: { $lte: (_a = settings[0]) === null || _a === void 0 ? void 0 : _a.reorderLevel },
    });
    const orders = yield orderModel_1.default.find({ orderStatus: 'pending' });
    const currentMonthSales = yield orderModel_1.default.aggregate([
        {
            // Add the document and month Date to the document.
            $addFields: {
                // Get the document date from each of the document in the aggregation.
                documentMonth: { $month: '$createdAt' },
                // Get the current month from the current date.
                monthDate: { $month: new Date() },
            },
        },
        {
            // Match the document the added fields
            $match: { $expr: { $eq: ['$documentMonth', '$monthDate'] } },
        },
        // Filter out cancelled orders
        { $match: { orderStatus: { $ne: 'pending' } } },
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        {
            // Group and calculate the totalAmount.
            $group: {
                _id: null,
                totalSales: { $sum: '$totalAmount' },
            },
        },
    ]);
    const newCustomers = yield userModel_1.default.aggregate([
        {
            $addFields: {
                documentMonth: { $month: '$createdAt' },
                dateMonth: { $month: new Date() },
            },
        },
        { $match: { $expr: { $eq: ['$documentMonth', '$dateMonth'] } } },
        {
            $group: {
                _id: null,
                freshCustomers: { $sum: 1 },
            },
        },
    ]);
    const monthlySales = yield orderModel_1.default.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $match: { orderStatus: { $ne: 'pending' } } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                sales: { $sum: '$totalAmount' },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
    ]);
    const chartData = monthlySales.map((item) => {
        const { _id: { year, month }, sales, } = item;
        // Format date using dayjs
        const date = (0, dayjs_1.default)()
            .month(month - 1)
            .year(year)
            .format('MMM YY');
        return { month: date, sales: sales / 1000 };
    });
    const topProducts = yield orderItemsModel_1.default.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $group: {
                _id: '$products.productName',
                quantitySold: { $sum: '$quantity' },
            },
        },
        { $sort: { quantitySold: -1 } },
        { $limit: 5 },
    ]);
    const topFiveProducts = topProducts.map((item) => {
        const { _id, quantitySold } = item;
        return { productName: _id.at(0), quantitySold };
    });
    const topCustomers = yield orderModel_1.default.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'users',
            },
        },
        {
            $group: {
                _id: '$users.fullName',
                totalSales: { $sum: '$totalAmount' },
            },
        },
        {
            $sort: { totalSales: -1 },
        },
        { $limit: 5 },
    ]);
    const topFiveCustomers = topCustomers.map((item) => {
        const { _id, totalSales } = item;
        return { customerName: _id.at(0), totalSales };
    });
    res.json({
        topFiveCustomers,
        topFiveProducts,
        stockOut: products.length,
        pendingOrder: orders.length,
        currentMonthSales: ((_b = currentMonthSales[0]) === null || _b === void 0 ? void 0 : _b.totalSales) || 0,
        newCustomers: ((_c = newCustomers[0]) === null || _c === void 0 ? void 0 : _c.freshCustomers) || 0,
        chartData,
    });
});
exports.dashboardMetrics = dashboardMetrics;

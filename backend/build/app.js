"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
// Import error middlewares
const notfoundHandler_1 = __importDefault(require("./middlewares/notfoundHandler"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
// Temp router
const devRoutes_1 = __importDefault(require("./features/devData/devRoutes"));
// Import routes
const authRoutes_1 = __importDefault(require("./features/authentication/authRoutes"));
const userRoutes_1 = __importDefault(require("./features/users/userRoutes"));
const categoryRoutes_1 = __importDefault(require("./features/categories/categoryRoutes"));
const subCatRoutes_1 = __importDefault(require("./features/subcategories/subCatRoutes"));
const productRoutes_1 = __importDefault(require("./features/products/productRoutes"));
const reviewRoutes_1 = __importDefault(require("./features/reviews/reviewRoutes"));
const cartRoutes_1 = __importDefault(require("./features/carts/cartRoutes"));
const checkoutRoutes_1 = __importDefault(require("./features/orders/checkoutRoutes"));
const orderRoutes_1 = __importDefault(require("./features/orders/orderRoutes"));
const statsRoutes_1 = __importDefault(require("./features/stats/statsRoutes"));
const settingRoutes_1 = __importDefault(require("./features/settings/settingRoutes"));
const sliderRoutes_1 = __importDefault(require("./features/sliders/sliderRoutes"));
// Create express application.
const app = (0, express_1.default)();
// mount application wide middlewares
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        'img-src': ["'self'", 'https: data:'],
    },
}));
// app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express_1.default.static(path_1.default.resolve(__dirname, './../../client/dist')));
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
// mount dev route
app.use('/api/v1/devs', devRoutes_1.default);
// mount routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/categories', categoryRoutes_1.default);
app.use('/api/v1/subcategories', subCatRoutes_1.default);
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/reviews', reviewRoutes_1.default);
app.use('/api/v1/carts', cartRoutes_1.default);
app.use('/api/v1/checkout', checkoutRoutes_1.default);
app.use('/api/v1/orders', orderRoutes_1.default);
app.use('/api/v1/stats', statsRoutes_1.default);
app.use('/api/v1/settings', settingRoutes_1.default);
app.use('/api/v1/sliders', sliderRoutes_1.default);
// import dist from './../../client/dist';
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, './../../client/dist', 'index.html'));
});
// mount application wide error handlers
app.use(notfoundHandler_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;

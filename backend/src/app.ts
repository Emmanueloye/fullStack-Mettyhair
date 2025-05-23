import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
// Security packages
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'x-xss-protection';
import cors from 'cors';

import * as AppError from './errors/appError';

// Import error middlewares
import notFoundMiddleware from './middlewares/notfoundHandler';
import globalErrorMiddleware from './middlewares/globalErrorHandler';

// Temp router
import devRouter from './features/devData/devRoutes';

// Import routes
import authRouter from './features/authentication/authRoutes';
import userRouter from './features/users/userRoutes';
import categoryRouter from './features/categories/categoryRoutes';
import subcategoryRouter from './features/subcategories/subCatRoutes';
import productRouter from './features/products/productRoutes';
import reviewRouter from './features/reviews/reviewRoutes';
import cartRouter from './features/carts/cartRoutes';
import checkoutRouter from './features/orders/checkoutRoutes';
import orderRouter from './features/orders/orderRoutes';
import statsRouter from './features/stats/statsRoutes';
import settingRouter from './features/settings/settingRoutes';
import sliderRouter from './features/sliders/sliderRoutes';
import salesOrderRouter from './features/salesOrder/salesOrderRoutes';
import contactRouter from './features/contacts/contactRoutes';
import contactReplyRouter from './features/contacts/contactReplyRoutes';
import blogRouter from './features/blogs/blogRoutes';
import reportRouter from './features/accounting/reportRoutes';
import locationRouter from './features/location/locationRoutes';
import expenseHeadRouter from './features/accounting/expenseHead/expenseHeadRoutes';
import expenseRouter from './features/accounting/expensePosting/expenseRoutes';

// Create express application.
const app = express();

// mount application wide middlewares

// Set HTTP request headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
    },
  })
);

app.use(cors());

// setup rate limiter
const limiter = rateLimit({
  windowMs: Number(process.env.WINDOWMS) * 60 * 1000,
  limit: Number(process.env.LIMIT),
  message: new AppError.TooManyRequest(
    'Too many requests. Please retry again after 30 minutes'
  ),
  legacyHeaders: false,
});

// Mount rate limiter
app.use(limiter);

// Middleware for Reading data from request body
app.use(express.json({ limit: '50kb' }));

// To prevent against nosql injection
app.use(mongoSanitize());

// To prevent cross site attack (xss)
app.use(xss());

// To prevent against http parameter pollution
app.use(hpp());

app.use(cookieParser(process.env.JWT_SECRET));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, './../../client/dist')));

// mount dev route
app.use('/api/v1/devs', devRouter);

// mount routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/subcategories', subcategoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/checkout', checkoutRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/settings', settingRouter);
app.use('/api/v1/sliders', sliderRouter);
app.use('/api/v1/sales-orders', salesOrderRouter);
app.use('/api/v1/contacts', contactRouter);
app.use('/api/v1/contact-replies', contactReplyRouter);
app.use('/api/v1/posts', blogRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/expense-head', expenseHeadRouter);
app.use('/api/v1/expenses', expenseRouter);

// import dist from './../../client/dist';

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, './../../client/dist', 'index.html'));
});

// mount application wide error handlers
app.use(notFoundMiddleware);
app.use(globalErrorMiddleware);

export default app;

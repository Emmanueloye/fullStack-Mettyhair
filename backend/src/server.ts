import 'express-async-errors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Handles all uncaught expections
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION');
  console.error(`${err.name}: ${err.message}`);
});

// import app to create server
import app from './app';

// set up database connection
mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => console.log(`Database connected...`));

// set up the application server
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Server listening on port:${port}`)
);

// Handle all unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION ⚠⚠⚠');
  console.error(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

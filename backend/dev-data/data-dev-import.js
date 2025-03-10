// import mongoose from 'mongoose';
// import fs from 'fs';
// import Product from '../features/products/productModel';

const mongoose = require('mongoose');
const fs = require('fs');
// const Product = require('../src/features/products/productModel');
const Country = require('../src/features/location/countryModel.ts');

mongoose
  .connect(`${process.env.DATABASE_URI}`)
  .then(() => console.log('DB connected..'));

// const products = JSON.parse(
//   fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
// );
const countries = JSON.parse(
  fs.readFileSync(`${__dirname}/countries.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Country.create(countries);
    console.log('data loaded successfull');
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('data deleted successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

import { Request, Response } from 'express';
import Product from '../products/productModel';
import Review from '../reviews/reviewModel';
import fs from 'fs';

export const uploadDevData = async (req: Request, res: Response) => {
  try {
    const newProducts = JSON.parse(
      fs.readFileSync(`${__dirname}/newProducts.json`, 'utf-8')
    );
    await Product.create(newProducts);
    console.log('data loaded successfull');
    res.send('data loaded successfull');
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const deleteDevData = async (req: Request, res: Response) => {
  try {
    await Product.deleteMany();
    await Review.deleteMany();
    console.log('data deleted successfull');
    res.send('data deleted successfull');
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

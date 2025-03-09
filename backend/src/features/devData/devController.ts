import { Request, Response } from 'express';
import Product from '../products/productModel';
import Review from '../reviews/reviewModel';
import Country from '../location/countryModel';
import State from '../location/stateModel';
import City from '../location/cityModel'
import fs from 'fs';

export const uploadDevData = async (req: Request, res: Response) => {
  try {
    const cities = JSON.parse(
      fs.readFileSync(`${__dirname}/cities.json`, 'utf-8')
    );
    await City.create(cities);
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

import Order from '../orders/orderModel';
import OrderItem from '../orders/orderItemsModel';
import { Request, Response } from 'express';

export const createOrder = (req: Request, res: Response) => {
  console.log(req.body);

  res.send(req.body);
};

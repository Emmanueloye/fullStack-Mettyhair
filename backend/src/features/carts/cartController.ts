import Cart from './cartModel';
import * as factory from '../../utils/handlerFactory';
import { Request, Response } from 'express';
import * as cartService from './cartService';

export const addToCart = async (req: Request, res: Response) => {
  await cartService.AddProductToCart(req, res);
};

export const getAllCarts = async (req: Request, res: Response) => {
  await cartService.getUserCarts(req, res);
};

export const updateCart = factory.updateOne({
  Model: Cart,
  label: 'cart',
  includedFields: ['quantity'],
});

export const deleteCart = factory.deleteOne({ Model: Cart, label: 'cart' });

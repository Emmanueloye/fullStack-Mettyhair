import Order from './orderModel';
import OrderItems from './orderItemsModel';
import { NextFunction, Request, Response } from 'express';
import * as util from '../../utils';
import statusCodes from '../../errors/statusCodes';
import * as orderService from './orderService';
import * as factory from '../../utils/handlerFactory';

// For currently logged in user.
export const getUserOrder = async (req: Request, res: Response) => {
  const { page, orders } = await orderService.getCurrentUserOrders(req);

  res
    .status(statusCodes.OK)
    .json({ status: 'success', noHits: orders.length, page, orders });
};

export const getOrder = async (req: Request, res: Response) => {
  const { order, orderItems } = await orderService.getSingleOrder(req);
  res.status(statusCodes.OK).json({ status: 'success', order, orderItems });
};

// For Admin only.
export const getAllOrders = factory.getAll({ Model: Order, label: 'orders' });

export const updateOrder = factory.updateOne({
  Model: Order,
  label: 'order',
  includedFields: [
    'orderStatus',
    'confirmationDate',
    'invoiceDate',
    'confirmedBy',
    'deliveryDate',
    'deliveredBy',
  ],
});

// export const returnOrder = async (req: Request, res: Response) => {};

export const setOrderUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.orderStatus === 'confirmed') {
    req.body.confirmationDate = Date.now();
    req.body.invoiceDate = Date.now();
    req.body.confirmedBy = req.user!.id;
  }
  if (req.body.orderStatus === 'delivered') {
    req.body.deliveryDate = Date.now();
    req.body.deliveredBy = req.user!.id;
  }
  next();
};

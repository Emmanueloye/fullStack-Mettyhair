import Order from '../orders/orderModel';
import OrderItems from '../orders/orderItemsModel';
import Product from '../products/productModel';
import { Request, Response } from 'express';
import ShortUniqueId from 'short-unique-id';
import { startSession } from 'mongoose';
import statusCodes from '../../errors/statusCodes';
import * as factory from '../../utils/handlerFactory';
import * as AppError from '../../errors/appError';
import * as salesOrderService from './SalesOrderService';

export const createOrder = async (req: Request, res: Response) => {
  await salesOrderService.createOneOrder(req);

  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'Sales order created successfully.' });
};

export const getSalesOrders = factory.getAll({
  Model: Order,
  label: 'salesOrders',
});

export const getSalesOrder = factory.getOne({
  Model: Order,
  label: 'salesOrder',
  populateOption: { path: 'orderItems' },
});

export const updateSalesOrder = async (req: Request, res: Response) => {
  await salesOrderService.updateOneOrder(req);

  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Sales order updated.',
  });
};

export const invoiceOrder = async (req: Request, res: Response) => {
  await salesOrderService.generateInvoice(req);
  res.status(statusCodes.OK).json({
    status: 'success',
    message: `Invoice created for SO-${req.body.orderNo}`,
  });
};

export const payOnInvoice = async (req: Request, res: Response) => {
  // check if the order has been invoiced, otherwise, throw error that payment cannot be created for order yet to be invoiced.
  // Check if amount paid already has any number, if yes, append the new number. Do same for payment date.
  await salesOrderService.settleInvoice(req);

  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'Invoice settled.' });
};

import Order from '../orders/orderModel';
import { Request, Response } from 'express';
import statusCodes from '../../errors/statusCodes';
import * as factory from '../../utils/handlerFactory';
import * as salesOrderService from './SalesOrderService';
import * as utils from '../../utils';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';

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

export const wholeSellerOrders = async (req: Request, res: Response) => {
  const doc = new utils.GetRequestAPI(
    Order.find({ user: req.user!.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const orders = await doc.query;

  const queryReq = new utils.GetRequestAPI(
    Order.find({ user: req.user!.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();

  let page;
  if (req.query.page) page = utils.paginateDetails(documentCount, req);

  res.status(statusCodes.OK).json({
    status: 'success',
    noHits: orders.length,
    page,
    salesOrders: orders,
  });
};

export const payCreation = async (req: Request, res: Response) => {
  const settledInvoices = await salesOrderService.createPayment(req);
  res.status(statusCodes.OK).json({ settledInvoices });
};

export const validateUserInput = checkForErrors([
  body('customerId').notEmpty().withMessage('Customer name field is required.'),
  body('email')
    .notEmpty()
    .withMessage('Email field is required.')
    .isEmail()
    .withMessage('Email must be a valid email.'),
  body('phone').notEmpty().withMessage('Phone number field is required.'),
  body('address').notEmpty().withMessage('Address field is required.'),
]);

export const validatePayment = checkForErrors([
  body('user').notEmpty().withMessage('Customer field is required.'),
  body('payment').notEmpty().withMessage('Payment field is required.'),
]);

import { Request, Response } from 'express';
import Transactions from './transactionsModel';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';
import * as AppError from '../../errors/appError';
import statusCodes from '../../errors/statusCodes';
import * as utils from '../../utils';
import OrderItems from '../orders/orderItemsModel';
import Order from '../orders/orderModel';

export const customerStatement = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  if (startDate > endDate) {
    throw new AppError.BadRequestError(
      'End date cannot be earlier than the start date.'
    );
  }

  const lastDate = utils.reportLastDate(endDate);

  const priorDateData = await Transactions.find({
    user: req.body.user,
    date: { $gte: new Date('2025-01-01'), $lte: startDate },
  });

  const openingBal = priorDateData.reduce((acc, curr) => {
    if (curr.orderId) return acc + curr.amount;
    if (curr.paymentId) return acc - curr.amount;
    return acc;
  }, 0);

  const statement = await Transactions.find({
    user: req.body.user,
    date: { $gte: new Date(startDate), $lte: lastDate },
  });
  res.status(statusCodes.OK).json({
    status: 'success',
    openingBal,
    noHits: statement.length,
    statement,
  });
};

export const salesReports = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;

  const salesReport = await Order.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    orderStatus: 'invoiced',
  }).populate({ path: 'orderItems' });
  res.send({ noHits: salesReport.length, salesReport });
};

export const validateDateInput = checkForErrors([
  body('startDate')
    .notEmpty()
    .withMessage('Report start date is required.')
    .isDate()
    .withMessage('Kindly provide a valid date for start date.'),
  body('endDate')
    .notEmpty()
    .withMessage('Report end date is required.')
    .isDate()
    .withMessage('Kindly provide a valid date for end date.'),
]);

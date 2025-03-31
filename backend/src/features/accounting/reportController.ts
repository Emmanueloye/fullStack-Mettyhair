import { Request, Response } from 'express';
import Transactions from './transactionsModel';
import { checkForErrors } from '../../utils/validate';
import { body, param, query } from 'express-validator';
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
  const { startDate, endDate } = req!.query;

  if (startDate! > endDate!) {
    throw new AppError.BadRequestError(
      'End date cannot be earlier than the start date.'
    );
  }

  const lastDate = utils.reportLastDate(endDate as string);

  const salesReport = await Order.aggregate([
    {
      $match: {
        invoiceDate: {
          $gte: new Date(startDate as string),
          $lte: new Date(lastDate),
        },
      },
    },
    {
      $sort: { invoiceDate: -1 },
    },
    {
      $lookup: {
        from: 'orderitems',
        localField: 'orderNo',
        foreignField: 'orderNo',
        as: 'orderItems',
      },
    },
    {
      $unwind: '$orderItems', // Deconstructs the orderItems array
    },
    {
      $lookup: {
        from: 'products', // The name of the Product collection
        localField: 'orderItems.productId',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: {
        path: '$products',
        preserveNullAndEmptyArrays: true, // Optional: keep order items without product details
      },
    },
    {
      $group: {
        _id: '$customerName', // Group by customer name
        orderItems: {
          $push: {
            $mergeObjects: [
              '$orderItems',
              { productName: '$products.productName' },
            ],
          },
        },
        totalQuantity: { $sum: '$orderItems.quantity' },
        totalOrderAmount: {
          $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] },
        },
      },
    },

    {
      $project: {
        customerName: '$_id',
        orderNo: 1,
        invoiceNo: 1,
        orderItems: 1,
        totalQuantity: 1,
        totalOrderAmount: 1,
      },
    },
  ]);

  // res.send({ noHits: salesReport.length, salesReport });
  res.json({ status: 'success', noHits: salesReport.length, salesReport });
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

export const validateSalesDateInput = checkForErrors([
  query('startDate')
    .notEmpty()
    .withMessage('Report start date is required.')
    .isDate()
    .withMessage('Kindly provide a valid date for start date.'),
  query('endDate')
    .notEmpty()
    .withMessage('Report end date is required.')
    .isDate()
    .withMessage('Kindly provide a valid date for end date.'),
]);

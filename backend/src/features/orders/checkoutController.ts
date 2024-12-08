import { Request, Response } from 'express';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';
import crypto from 'crypto';
import * as checkoutService from './checkoutService';

export const checkout = async (req: Request, res: Response) => {
  await checkoutService.initializeCheckout(req, res);
};

export const verifyCheckout = async (req: Request, res: Response) => {
  // In the dashboard, under webhook url, put the path that matches the back end path.

  // Based on the initialization request, an event is emitted back to the server which is handled in verify checkout handler.
  let eventData;

  const hash = crypto
    .createHmac('sha512', `${process.env.PAYSTACK_SECRET_KEY}`)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    eventData = req.body;
  }

  const data = eventData.data;
  await checkoutService.verifyTransaction(data, eventData, res);
};

export const paymentConfirmation = async (req: Request, res: Response) => {
  const order = await checkoutService.checkoutConfirmation(req);
  res.status(200).json({ status: 'success', order });
};

// Validation
export const validateCheckout = checkForErrors([
  body('fullName').notEmpty().withMessage('Full name field is required.'),
  body('email').notEmpty().withMessage('Email field is required.'),
  body('phone').notEmpty().withMessage('Phone field is required.'),
  body('address').notEmpty().withMessage('Address field is required.'),
  body('state').notEmpty().withMessage('State field is required.'),
  body('country').notEmpty().withMessage('Country field is required.'),
]);

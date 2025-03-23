import { Request, Response } from 'express';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';
import crypto from 'crypto';
import * as checkoutService from './checkoutService';
import axios, { isAxiosError } from 'axios';
import day from 'dayjs';

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

export const getDHLRate = async (req: Request, res: Response) => {
  const username = process.env.DHL_API_KEY;
  const password = process.env.DHL_API_SECRET;
  try {
    const resp = await axios.get(`${process.env.DHL_TEST_URL}/rates`, {
      params: {
        accountNumber: 365338347, //process.env.ACCOUNT_NUMB
        originCountryCode: process.env.ORIGIN_COUNTRY,
        originCityName: 'MUSHIN', //process.env.ORIGIN_CITY,
        destinationCountryCode: 'US', //req.body.country
        destinationCityName: 'Abbeville', //req.body.city
        weight: 2, //req.body.weight
        length: 1,
        width: 1,
        height: 1,
        plannedShippingDate: day(new Date(Date.now())).format('YYYY-MM-DD'),
        isCustomsDeclarable: true,
        unitOfMeasurement: 'metric',
      },
      headers: {
        'Content-Type': 'application/json',
        'x-version': '2.12.0',
      },
      auth: {
        username: username as string,
        password: password as string,
      },
    });
    res.send(resp.data);
  } catch (error) {
    if (isAxiosError(error)) {
      // console.log(error.response?.data);

      res.send(error.response?.data);
    }
  }
};
export const dhl = async (req: Request, res: Response) => {
  const username = process.env.DHL_API_KEY;
  const password = process.env.DHL_API_SECRET;

  try {
    const resp = await axios.get(
      `${process.env.DHL_TEST_URL}/address-validate`,
      {
        params: { type: 'delivery', countryCode: 'NG', cityName: 'mushin' },
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.DHL_API_KEY as string,
          password: process.env.DHL_API_SECRET as string,
        },
      }
    );
    res.send(resp.data);
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);

      res.send(error.response?.data);
    }
  }
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

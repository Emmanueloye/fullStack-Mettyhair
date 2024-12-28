import { Request, Response } from 'express';
import Order from './orderModel';
import OrderItems from './orderItemsModel';
import Product from '../products/productModel';
import Cart from '../carts/cartModel';
import * as util from '../../utils';
import axios from 'axios';
import statusCodes from '../../errors/statusCodes';
import { startSession } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import * as AppError from '../../errors/appError';

export const initializeCheckout = async (req: Request, res: Response) => {
  // Get all cart items for the currently logged in user.
  const carts = await Cart.find<util.ExtendedCart>({ user: req.user!.id });
  // Calculate subtotal and total discount.
  const { subtotal, totalDiscount } = util.calcCartTotal(carts);

  // Specify checkout data
  const checkoutData = {
    email: req.body.email,
    amount: (subtotal - totalDiscount) * 100,
    callback_url: process.env.PAYSTACK_cALLBACK_URL,
    metadata: {
      orderName: req.body.fullName,
      customerName: req.user!.fullName,
      user: req.user!.id,
      phone: req.body.phone,
      state: req.body.state,
      country: req.body.country,
      subtotal,
      discount: totalDiscount,
      note: req.body.note,
      address: req.body.address,
    },
  };

  // Send a post request to paystack transaction/initialize api endpoint.
  try {
    const resp = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      checkoutData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // Destructure the required data from the response received from the api.
    const { authorization_url, access_code, reference } = resp.data.data;
    // Send back to the user
    res.status(statusCodes.OK).json({
      status: 'success',
      checkout: { authorization_url, access_code, reference },
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

type DataType = {
  status: string;
  metadata: {
    subtotal: number;
    discount: number;
    customerName: string;
    orderName: string;
    user: string;
    address: string;
    phone: string;
    state: string;
    country: string;
    note: string;
  };
  amount: number;
  id: number;
  reference: string;
  fees: number;
  authorization: { cardType: string };
  currency: string;
  paid_at: Date;
};

export const verifyTransaction = async (
  data: DataType,
  eventData: { event: string },
  res: Response
) => {
  try {
    if (data.status === 'success' && eventData.event === 'charge.success') {
      const uid = new ShortUniqueId({ length: 8 });
      const orderNumber = uid.rnd();
      const session = await startSession();

      await session.withTransaction(async () => {
        // Create new order.
        const newOrder = await Order.create({
          orderNo: orderNumber,
          subtotal: data.metadata.subtotal,
          discount: data.metadata.discount,
          totalAmount: data.amount / 100,
          amountPaid: data.amount / 100,
          customerName: data.metadata.customerName,
          orderName: data.metadata.orderName,
          user: data.metadata.user,
          transactionId: data.id,
          invoiceNo: Math.floor(data.id / 2),
          reference: data.reference,
          charges: data.fees / 100,
          cardType: data.authorization.cardType,
          currency: data.currency,
          paymentDate: data.paid_at,
          address: data.metadata.address,
          phone: data.metadata.phone,
          state: data.metadata.state,
          country: data.metadata.country,
          note: data.metadata.note,
          isPaid: 'paid',
        });

        // Get cart items.
        const carts = await Cart.find<util.ExtendedCart>({
          user: data.metadata.user,
        });

        // Loop through the cart and save cart items into order items.
        for (let cart of carts) {
          // Get the product from cart
          const product = await Product.findOne({ _id: cart.product._id });

          // Save cart item into order item collection.
          await OrderItems.create({
            orderId: newOrder._id,
            orderNo: orderNumber,
            productId: cart.product,
            color: cart.color,
            quantity: cart.quantity,
            sellingPrice: cart.product.sellingPrice,
            discountPrice: cart.product.discountPrice,
            costPrice: cart.product.costPrice,
            price: cart.product.discountPrice
              ? cart.product.discountPrice
              : cart.product.sellingPrice,
            createdAt: Date.now(),
          });

          // If product and quantity exist, back out the sales from the existing product quantity.
          if (product && product.quantity) {
            product.quantity -= cart.quantity;
            await product.save();
          }

          // Delete cart item.
          await cart.deleteOne();
        }
      });
      await session.endSession();
      res.status(200).json({ status: 'success' });
    } else {
      res.status(400).json({ status: 'failed' });
    }
  } catch (error) {
    res.status(400).json({ status: 'Something went wrong. try again later.' });
  }
};

export const checkoutConfirmation = async (req: Request) => {
  const order = await Order.findOne({ reference: req.query.reference });
  if (!order)
    throw new AppError.NotFoundError(
      `We could not find order resource you are looking for.`
    );
  return order;
};

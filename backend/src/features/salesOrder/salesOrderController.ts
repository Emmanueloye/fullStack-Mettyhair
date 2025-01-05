import Order from '../orders/orderModel';
import OrderItem from '../orders/orderItemsModel';
import Product from '../products/productModel';
import { Request, Response } from 'express';
import ShortUniqueId from 'short-unique-id';
import { startSession } from 'mongoose';
import statusCodes from '../../errors/statusCodes';
import * as factory from '../../utils/handlerFactory';

export const createOrder = async (req: Request, res: Response) => {
  // Unique id for order number.
  const uid = new ShortUniqueId({ length: 8 });
  const orderNo = uid.rnd();

  // Starting session
  const session = await startSession();

  // Declare variables to calculate  the total costs
  let subtotal = 0;
  let discount = 0;
  let totalCost = 0;

  // Calculating order totals
  for (const item of JSON.parse(req.body.orders)) {
    // Get current product in the loop as we do not want to rely on pricing from frontend to prevent manupulation.
    const currentProduct = await Product.findById(item.product);
    // Calculate total selling price which will be subtotal.
    if (currentProduct?.sellingPrice) {
      subtotal += currentProduct.sellingPrice * item.quantity;
    }

    // Calculate total cost for the incomeing order.
    if (currentProduct?.costPrice) {
      totalCost += currentProduct.costPrice * item.quantity;
    }

    // Calculate the total discount given on the order.
    if (currentProduct?.discountPrice && currentProduct?.sellingPrice) {
      discount +=
        (currentProduct.sellingPrice - currentProduct.discountPrice) *
        item.quantity;
    }
  }

  await session.withTransaction(async () => {
    // Create new order
    const newOrder = await Order.create({
      orderNo,
      subtotal,
      discount,
      totalAmount: subtotal - discount,
      totalCost,
      isPaid: 'not paid',
      amountPaid: 0,
      customerName: req.body.orderName,
      orderName: req.body.orderName,
      address: req.body.address,
      phone: req.body.phone,
      user: req.user?.id,
      isManual: true,
      createdBy: req.user?.id,
    });
    for (const item of JSON.parse(req.body.orders)) {
      // Get the current product in the loop to get pricing information.
      const currentProduct = await Product.findById(item.product);

      // Create order item for each of the line
      await OrderItem.create({
        orderId: newOrder._id,
        orderNo,
        productId: item.product,
        color: item.color,
        quantity: item.quantity,
        sellingPrice: currentProduct?.sellingPrice,
        discountPrice: currentProduct?.discountPrice,
        costPrice: currentProduct?.costPrice,
        price: currentProduct?.discountPrice
          ? currentProduct.discountPrice
          : currentProduct?.sellingPrice,
      });
    }
  });
  await session.endSession();

  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'Sales order created successfully.' });
};

export const getSalesOrders = factory.getAll({
  Model: Order,
  label: 'salesOrders',
});

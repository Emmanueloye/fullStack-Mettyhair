import { Request } from 'express';
import { startSession } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import Product from '../products/productModel';
import Order from '../orders/orderModel';
import OrderItems from '../orders/orderItemsModel';
import Payment from '../accounting/paymentModel';
import * as utils from '../../utils';
import * as AppError from '../../errors/appError';
import statusCodes from '../../errors/statusCodes';

//
export const createOneOrder = async (req: Request) => {
  // Unique id for order number.
  const uid = new ShortUniqueId({ length: 8 });
  const orderNo = uid.rnd();

  // Starting session
  const session = await startSession();

  // Calculate sales order numbers
  const { subtotal, discount, totalCost } = await utils.calculateOrderMetrics(
    req,
    Product
  );

  await session.withTransaction(async () => {
    // Create new order
    const newOrder = await Order.create({
      orderNo,
      subtotal,
      discount,
      totalAmount: subtotal - discount,
      totalCost,
      customerName: req.body.orderName,
      orderName: req.body.orderName,
      address: req.body.address,
      phone: req.body.phone,
      user: req.body.customerId,
      isManual: true,
      createdBy: req.user?.id,
    });
    for (const item of JSON.parse(req.body.orders)) {
      // Get the current product in the loop to get pricing information.
      const currentProduct = await Product.findById(item.product);

      // Create order item for each of the line
      await OrderItems.create({
        orderId: newOrder._id,
        orderNo,
        productId: item.product,
        size: item.size,
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
};

// Update sales Order
export const updateOneOrder = async (req: Request) => {
  // Starting session
  const session = await startSession();

  // Calculate sales order numbers
  const { subtotal, discount, totalCost } = await utils.calculateOrderMetrics(
    req,
    Product
  );

  await session.withTransaction(async () => {
    const inputtedData = {
      subtotal,
      discount,
      totalAmount: subtotal - discount,
      totalCost,
      amountPaid: 0,
      customerName: req.body.orderName,
      orderName: req.body.orderName,
      address: req.body.address,
      phone: req.body.phone,
      user: req.body.customerId,
      isManual: true,
      updatedBy: req.user?.id,
    };

    await Order.findByIdAndUpdate(req.params.id, inputtedData, {
      new: true,
      runValidators: true,
    });

    // Update order Item
    for (const item of JSON.parse(req.body.orders)) {
      const currentProduct = await Product.findById(item.product);

      const updatedData = {
        productId: item.product,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        sellingPrice: currentProduct?.sellingPrice,
        discountPrice: currentProduct?.discountPrice,
        costPrice: currentProduct?.costPrice,
        price: currentProduct?.discountPrice
          ? currentProduct.discountPrice
          : currentProduct?.sellingPrice,
      };
      await OrderItems.findByIdAndUpdate(item.orderItemId, updatedData, {
        new: true,
        runValidators: true,
      });
    }
  });
};

export const generateInvoice = async (req: Request) => {
  // Unique id
  const uuid = new ShortUniqueId({ length: 7 });
  // current order
  const currentOrder = await Order.findById(req.params.id);

  // Check if we are re-invoicing already invoiced order.
  if (currentOrder?.orderStatus === 'invoiced') {
    throw new AppError.BadRequestError('Order has been invoiced already.');
  }

  // Get current orderItems associated with the currentOrder
  const currentOrderItems = await OrderItems.find({
    orderId: currentOrder!._id,
  });

  // Save invoice details
  currentOrder!.invoiceNo = uuid.rnd();
  currentOrder!.invoiceDate = new Date(Date.now());
  currentOrder!.invoicedBy = req.user!.id;
  currentOrder!.orderStatus = 'invoiced';
  await currentOrder?.save();

  // backout quantity in orderitem from product quantity
  for (const item of currentOrderItems) {
    const currentProduct = await Product.findById(item.productId!._id);

    currentProduct!.quantity =
      (currentProduct!.quantity as number) - (item!.quantity as number);
    await currentProduct?.save();
  }
};

export const settleInvoice = async (req: Request) => {
  const session = await startSession();
  const currentOrder = await Order.findById(req.params.id);

  if (currentOrder) {
    const alreadyPaidAmt = currentOrder?.amountPaid.reduce(
      (acc, amt) => acc + amt,
      0
    );
    if (currentOrder?.orderStatus === 'pending') {
      throw new AppError.BadRequestError(
        'Please invoice the sales order before trying to settle the invoice.'
      );
    }

    if (currentOrder?.totalAmount === alreadyPaidAmt) {
      throw new AppError.BadRequestError(
        'Transaction failed because invoice has been fully paid for.'
      );
    }

    if (alreadyPaidAmt + +req.body.payment > currentOrder.totalAmount) {
      throw new AppError.BadRequestError(
        `You cannot settle more than the invoice amount. The payment is ₦${Math.abs(
          currentOrder.totalAmount - alreadyPaidAmt - req.body.payment
        )} more than the invoice amount.`
      );
    }

    await session.withTransaction(async () => {
      await Payment.create({
        amountPaid: req.body.payment,
        invoiceNo: currentOrder.invoiceNo,
        orderId: currentOrder._id,
        user: req.body.user,
      });
      // Update payment on order
      currentOrder.amountPaid.push(req.body.payment);
      currentOrder.paymentDate.push(new Date(Date.now()));
      currentOrder.paymentStatus =
        currentOrder.totalAmount === alreadyPaidAmt + +req.body.payment
          ? 'paid'
          : 'partial';
      await currentOrder.save();
    });
  }
};

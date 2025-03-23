import { Request } from 'express';
import { startSession } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import Product from '../products/productModel';
import Order from '../orders/orderModel';
import OrderItems from '../orders/orderItemsModel';
import Payment from '../accounting/paymentModel';
import Transaction from '../accounting/transactionsModel';
import * as utils from '../../utils';
import * as AppError from '../../errors/appError';
import statusCodes from '../../errors/statusCodes';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';

//
export const createOneOrder = async (req: Request) => {
  // Unique id for order number.
  const uid = new ShortUniqueId({ length: 8 });
  const orderNo = uid.rnd();

  // Starting session
  const session = await startSession();

  // Calculate sales order numbers
  const { subtotal, totalCost } = await utils.calculateOrderMetrics(
    req,
    Product
  );

  await session.withTransaction(async () => {
    // Create new order
    const newOrder = await Order.create({
      orderNo,
      subtotal,
      totalAmount: subtotal,
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
        sellingPrice: currentProduct?.wholeSalerPrice,
        // discountPrice: currentProduct?.discountPrice,
        costPrice: currentProduct?.costPrice,
        price: currentProduct?.wholeSalerPrice,
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
  const { subtotal, totalCost } = await utils.calculateOrderMetrics(
    req,
    Product
  );

  await session.withTransaction(async () => {
    const inputtedData = {
      subtotal,
      totalAmount: subtotal,
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
        sellingPrice: currentProduct?.wholeSalerPrice,
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

  const unMatchedPayments = await Payment.find({
    user: req.body.user,
    isFullySettled: false,
    UnsettledAmt: { $gt: 0 },
  });

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

    const quantity = item!.quantity as number;

    if (
      currentProduct &&
      currentProduct?.quantity &&
      currentProduct?.quantity < quantity
    ) {
      throw new AppError.BadRequestError(
        `Available quantity for ${currentProduct.productName} is lower than the ordered quantity. Restock to proceed with invoice.`
      );
    }

    currentProduct!.quantity =
      (currentProduct!.quantity as number) - (item!.quantity as number);
    await currentProduct?.save();
  }

  // Loop through the unmatched payment
  for (const item of unMatchedPayments) {
    // Get the current invoice
    const currentInvoice = await Order.findById(req.params.id);

    // Calculate payment already made.
    const alreadyPaid = currentInvoice!.amountPaid.reduce((a, b) => a + b, 0);
    // Calculate outstanding balance
    const outstandingBalance = currentInvoice!.totalAmount - alreadyPaid;

    // Check if outstanding balance is less or equals to unsettled amount, push the outstanding orders.
    if (
      item.UnsettledAmt &&
      outstandingBalance <= item.UnsettledAmt &&
      alreadyPaid !== currentInvoice!.totalAmount
    ) {
      currentInvoice!.amountPaid.push(outstandingBalance);
      currentInvoice!.paymentDate.push(new Date(Date.now()));
      currentInvoice!.paymentStatus = 'paid';
      currentInvoice!.paymentRef.push(item._id);
      await currentInvoice!.save();

      // Update payment data
      item.UnsettledAmt =
        item.UnsettledAmt - outstandingBalance > 0
          ? item.UnsettledAmt - outstandingBalance
          : undefined;
      item.isFullySettled =
        item.UnsettledAmt && item.UnsettledAmt - outstandingBalance === 0
          ? true
          : false;
      await item.save();

      return;
    }

    // But if outstanding balance is more than unsettled amount, push the payment.
    if (
      item.UnsettledAmt &&
      outstandingBalance > item.UnsettledAmt &&
      alreadyPaid !== currentOrder?.totalAmount
    ) {
      currentInvoice!.amountPaid.push(item.UnsettledAmt);
      currentInvoice!.paymentDate.push(new Date(Date.now()));
      currentInvoice!.paymentStatus = 'partial';
      currentInvoice!.paymentRef.push(item._id);
      await currentInvoice!.save();

      // Update payment data.
      item.UnsettledAmt = undefined;
      item.isFullySettled = true;
      await item.save();
    }
  }

  // Create transaction for the invoice
  const trans = await Transaction.create({
    orderId: currentOrder!._id,
    amount: currentOrder!.totalAmount,
    user: currentOrder?.user,
    date: new Date(Date.now()),
  });
};

export const createPayment = async (req: Request) => {
  // To create payment id
  const uid = new ShortUniqueId({ length: 8 });
  const payId = uid.rnd();

  // Sessions
  const session = await startSession();

  // Get all unsettled invoices for the current customer
  const unSettledOrders = await Order.find({
    user: req.body.user,
    isManual: true,
    orderStatus: 'invoiced',
    paymentStatus: { $ne: 'paid' },
  }).sort('createdAt');

  // Calculate the total outstanding invoices
  const totalOrdersToSettle = unSettledOrders
    .map(
      (item) =>
        item.totalAmount - item.amountPaid.reduce((acc, curr) => acc + curr, 0)
    )
    .reduce((acc, curr) => acc + curr, 0);

  type settledOrderTypes = {
    invoice: string | undefined | null;
    balance: number;
    amountSettled: number;
  };

  // Payment made by customer coming from user
  let payment: number = +req.body.payment;
  // To track the settled invoices.
  let settledOrders: settledOrderTypes[] = [];

  await session.withTransaction(async () => {
    // Create a new payment for the customer.
    const newPayment = await Payment.create({
      amountPaid: req.body.payment,
      paymentId: payId,
      user: req.body.user,
      isFullySettled: payment <= totalOrdersToSettle, //If payment is less or equals to total orders to settle then we know the payment will be fully utilized.
      UnsettledAmt:
        payment > totalOrdersToSettle
          ? payment - totalOrdersToSettle
          : undefined,
    });

    // Automatically run settlement for upaid and partially paid invoices
    for (const item of unSettledOrders) {
      // For partially paid invoice, this will have a value but zero for unpaid.
      const alreadyPaidAmt = item.amountPaid.reduce(
        (acc, curr) => acc + curr,
        0
      );
      // Calculate outstanding balance for each iteration.
      const outstandingBalance = item.totalAmount - alreadyPaidAmt;

      // Save the settlement data in order collections
      if (outstandingBalance <= payment) {
        // In this condition, the payment can partially or fully take care of the outstanding invoices.
        item.amountPaid.push(outstandingBalance);
        item.paymentDate.push(new Date(Date.now()));
        item.paymentStatus = 'paid';
        item.paymentRef.push(newPayment._id);
        payment -= outstandingBalance;

        await item.save();
        // Push order details into the array to be send to user as feedack
        settledOrders.push({
          invoice: item.invoiceNo,
          balance: outstandingBalance,
          amountSettled: outstandingBalance,
        });
      } else if (outstandingBalance > payment && payment > 0) {
        // In this condition, when unsettled invoice is more than payment, the payment is accepted as a partial payment.
        item.amountPaid.push(payment);
        item.paymentDate.push(new Date(Date.now()));
        item.paymentStatus = 'partial';
        item.paymentRef.push(newPayment._id);

        // Changing the value of payment
        payment -= payment;

        await item.save();
        settledOrders.push({
          invoice: item.invoiceNo,
          balance: outstandingBalance,
          amountSettled: +req.body.payment,
        });
      }
    }

    // Create the transaction for payment
    await Transaction.create({
      paymentId: newPayment!._id,
      amount: req.body.payment,
      user: req.body.user,
      date: new Date(Date.now()),
    });
  });
  await session.endSession();

  return settledOrders;
};

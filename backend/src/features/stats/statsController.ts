import { Request, Response } from 'express';
import Product from '../products/productModel';
import Order from '../orders/orderModel';
import OrderItems from '../orders/orderItemsModel';
import Setting from '../settings/settingModel';
import User from '../authentication/userModel';
import day from 'dayjs';

export const dashboardMetrics = async (req: Request, res: Response) => {
  const settings = await Setting.find();

  const products = await Product.find({
    quantity: { $lte: settings[0]?.reorderLevel },
  });

  const orders = await Order.find({ orderStatus: 'pending' });

  const currentMonthSales = await Order.aggregate([
    {
      // Add the document and month Date to the document.
      $addFields: {
        // Get the document date from each of the document in the aggregation.
        documentMonth: { $month: '$createdAt' },
        // Get the current month from the current date.
        monthDate: { $month: new Date() },
      },
    },
    {
      // Match the document the added fields
      $match: { $expr: { $eq: ['$documentMonth', '$monthDate'] } },
    },
    // Filter out cancelled orders
    { $match: { orderStatus: { $ne: 'pending' } } },
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    {
      // Group and calculate the totalAmount.
      $group: {
        _id: null,
        totalSales: { $sum: '$totalAmount' },
      },
    },
  ]);

  const newCustomers = await User.aggregate([
    {
      $addFields: {
        documentMonth: { $month: '$createdAt' },
        dateMonth: { $month: new Date() },
      },
    },
    { $match: { $expr: { $eq: ['$documentMonth', '$dateMonth'] } } },
    {
      $group: {
        _id: null,
        freshCustomers: { $sum: 1 },
      },
    },
  ]);

  const monthlySales = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $match: { orderStatus: { $ne: 'pending' } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        sales: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  const chartData = monthlySales.map((item) => {
    const {
      _id: { year, month },
      sales,
    } = item;
    // Format date using dayjs
    const date = day()
      .month(month - 1)
      .year(year)
      .format('MMM YY');

    return { month: date, sales: sales / 1000 };
  });

  const topProducts = await OrderItems.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $group: {
        _id: '$products.productName',
        quantitySold: { $sum: '$quantity' },
      },
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 5 },
  ]);

  const topFiveProducts = topProducts.map((item) => {
    const { _id, quantitySold } = item;
    return { productName: _id.at(0), quantitySold };
  });

  const topCustomers = await Order.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $group: {
        _id: '$users.fullName',
        totalSales: { $sum: '$totalAmount' },
      },
    },
    {
      $sort: { totalSales: -1 },
    },
    { $limit: 5 },
  ]);

  const topFiveCustomers = topCustomers.map((item) => {
    const { _id, totalSales } = item;
    return { customerName: _id.at(0), totalSales };
  });

  res.json({
    topFiveCustomers,
    topFiveProducts,
    stockOut: products.length,
    pendingOrder: orders.length,
    currentMonthSales: currentMonthSales[0]?.totalSales || 0,
    newCustomers: newCustomers[0]?.freshCustomers || 0,
    chartData,
  });
};

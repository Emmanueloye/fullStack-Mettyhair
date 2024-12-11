import Order from './orderModel';
import OrderItems from './orderItemsModel';
import { Request } from 'express';
import * as util from '../../utils';
import * as AppError from '../../errors/appError';

export const getCurrentUserOrders = async (req: Request) => {
  const filter = { user: req.user!.id };
  const getOrderQuery = new util.GetRequestAPI(Order.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const orders = await getOrderQuery.query;

  // To get the document count using the incoming query except for when there is pagination and limit on the request.
  const queryReq = new util.GetRequestAPI(Order.find(filter), req.query)
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();

  let page;
  if (req.query.page) page = util.paginateDetails(documentCount, req);

  return { page, orders };
};

export const getSingleOrder = async (req: Request) => {
  const order = await Order.findOne({ orderNo: req.params.id });

  if (!order) {
    throw new AppError.NotFoundError(
      'We could not found order resource you are looking for. '
    );
  }
  const orderItems = await OrderItems.find({ orderNo: req.params.id });

  return { order, orderItems };
};

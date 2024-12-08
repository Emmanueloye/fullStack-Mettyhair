import { Request, Response } from 'express';
import Cart from './cartModel';
import * as utils from '../../utils';
import statusCodes from '../../errors/statusCodes';
import * as AppError from '../../errors/appError';
import { Types } from 'mongoose';

type RefreshPayload = {
  payload: { token: Types.ObjectId; refresh: string };
  iat: number;
};

export const AddProductToCart = async (req: Request, res: Response) => {
  const { product, quantity, color, size, cartId } = req.body;

  const { refreshToken } = req.signedCookies;
  let filterObj;
  // if user is logged in, get existing cart using the login user and product id.
  if (refreshToken) {
    const decode = await utils.verifyJWT(refreshToken);
    req.body.user = (decode as RefreshPayload).payload.token;

    filterObj = { user: req.body.user, product };
  }

  // if user not logged in, get existing cart using cart id managed on frontend.
  if (!refreshToken) {
    req.body.cartId = cartId ? cartId : utils.generateToken({ type: 'plain' });
    filterObj = { cartId: req.body.cartId, product };
  }

  const existingCart = await Cart.findOne(filterObj);

  if (!existingCart) {
    const newCart = await Cart.create({
      user: req.body?.user,
      cartId: req.body?.cartId,
      product,
      quantity,
      color,
      size,
    });

    const cartId = newCart.cartId;

    res
      .status(statusCodes.CREATED)
      .json({ status: 'success', cartId, message: 'Product added to cart.' });
    return;
  }

  if (existingCart) {
    if (
      existingCart?.quantity !== +quantity ||
      existingCart?.color !== color ||
      existingCart?.size !== size
    ) {
      // update existing cart item
      existingCart!.quantity = quantity;
      existingCart!.color = color;
      existingCart!.size = size;
      await existingCart!.save();
    } else {
      throw new AppError.BadRequestError('Product already in cart.');
    }
    res
      .status(statusCodes.OK)
      .json({ status: 'success', message: 'Your cart has been updated.' });
    return;
  }
};

export const getUserCarts = async (req: Request, res: Response) => {
  // Update cartid with logged in user if it's available.
  let filterObj = await utils.updateCartQuery(req, Cart);

  const getFeatures = new utils.GetRequestAPI(Cart.find(filterObj), req.query)
    .filter()
    .sort()
    .limitDocuments()
    .limitFields()
    .paginate();

  const carts = await getFeatures.query;
  const updatedCarts = await utils.mergeCartItems(Cart, carts);

  // const documentCount = await Cart.find().countDocuments();

  // let page;
  // if (req.query.page) page = utils.paginateDetails(documentCount, req);

  res.status(statusCodes.OK).json({
    status: 'success',
    noHits: updatedCarts.length,
    // page,
    carts: updatedCarts,
  });
};

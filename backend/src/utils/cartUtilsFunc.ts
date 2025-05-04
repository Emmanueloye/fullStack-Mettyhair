import { Request } from 'express';
import * as utils from '../utils';
import { Types } from 'mongoose';
import { ICart } from '../features/carts/cartModel';

type RefreshPayload = {
  payload: { token: Types.ObjectId; refresh: string };
  iat: number;
};

export const mergeCartItems = async (Model: any, carts: any) => {
  const uniqueCarts = new Map();
  for (const cart of carts) {
    const cartId = cart.product.toString();

    if (!uniqueCarts.has(cartId)) {
      uniqueCarts.set(cartId, cart);
    } else {
      await Model.findOneAndDelete(cart._id);
    }
  }
  return [...uniqueCarts.values()];
};

export const updateCartQuery = async (req: Request, Cart: any) => {
  let filterObj: any = {};

  // If user is signed in, get the cart with cartId and update with user info
  if (req.signedCookies.refreshToken) {
    // Get carts with cartids
    const cartWithIds = await Cart.find({ cartId: req.headers.cartid });

    // Get the user id from the token
    const decode = await utils.verifyJWT(req.signedCookies.refreshToken);
    const user = (decode as RefreshPayload).payload.token;

    filterObj = { user };

    // Replace cartids with userid
    if (cartWithIds) {
      for (const cartItem of cartWithIds) {
        cartItem.user = user;
        cartItem.cartId = undefined;
        await cartItem.save();
      }
    }
  }

  // If the user is not signed in, we use cartid coming from request headers
  if (req.headers.cartid) {
    filterObj = { cartId: req.headers.cartid };
  }

  if (!req.signedCookies.refreshToken && !req.headers.cartid) {
    filterObj = { cartid: '' };
  }

  // This deals with users that are not logged in and do not have cart id in the header

  return filterObj;
};

export type ExtendedCart = {
  deleteOne(): unknown;
  _id: string;
  color: string;
  size?: string;
  user: Types.ObjectId;
  cartId: string;
  product: {
    _id: Types.ObjectId;
    productName: string;
    sellingPrice: number;
    discountPrice: number;
    costPrice: number;
  };
  quantity: number;
};

type AccType = {
  subtotal: number;
  totalDiscount: number;
  totalCost: number;
};

export const calcCartTotal = (carts: ExtendedCart[]) => {
  return carts.reduce(
    (acc: AccType, cart: ExtendedCart) => {
      const discountPerUnit = cart.product.discountPrice
        ? cart.product.sellingPrice - cart.product.discountPrice
        : 0;

      const subtotal = (acc.subtotal +=
        cart.product.sellingPrice * cart.quantity);

      const totalCost = (acc.totalCost +=
        cart.product.costPrice * cart.quantity);

      const totalDiscount = (acc.totalDiscount +=
        discountPerUnit * cart.quantity);
      return { subtotal, totalDiscount, totalCost };
    },
    { subtotal: 0, totalDiscount: 0, totalCost: 0 }
  );
};

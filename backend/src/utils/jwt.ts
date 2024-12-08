import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import * as AppError from '../errors/appError';
import { Response } from 'express';
import { promisify } from 'util';

type AccessPayload = {
  token: Types.ObjectId;
};
export type RefreshPayload = {
  token: Types.ObjectId;
  refresh: string;
};

export const createJWT = (payload: {
  payload: AccessPayload | RefreshPayload;
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

export const verifyJWT = async (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new AppError.UnAuthenticatedError('Invalid tokens credentials.');
  }
};

// Function that send cookies to users once logged in.
type CookieParams = { res: Response; token: Types.ObjectId; refresh: string };
export const sendCookies = ({ res, token, refresh }: CookieParams) => {
  // Create the JWT tokens
  const accessToken = createJWT({ payload: { token } });
  const refreshToken = createJWT({ payload: { token, refresh } });

  //   Send the cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * Number(process.env.ACCESS_TOKEN_EXPIRES),
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_EXPIRES),
    secure: process.env.NODE_ENV === 'production',
  });
};

// send empty token for logout
export const logoutToken = (res: Response) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    maxAge: 1,
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    maxAge: 1,
    secure: process.env.NODE_ENV === 'production',
  });
};

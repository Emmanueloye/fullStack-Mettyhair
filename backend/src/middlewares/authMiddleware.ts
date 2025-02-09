import { Request, Response, NextFunction } from 'express';
import User from '../features/authentication/userModel';
import Token from '../features/authentication/tokenModel';
import * as AppError from '../errors/appError';
import * as utils from '../utils';
import AccessDb from '../features/authentication/accessModel';

type AccessPayload = { payload: { token: string }; iat: number };
type RefreshPayload = {
  payload: { token: string; refresh: string };
  iat: number;
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log({ originalURL: req.originalUrl });
  // console.log({ baseURL: req.baseUrl });
  // console.log({ url: req.url });
  // console.log(req);

  // get the signed token of the login user.
  const { accessToken, refreshToken } = req.signedCookies;

  if (accessToken) {
    // verify the token and get out user id from it..

    const decoded = await utils.verifyJWT(accessToken);
    const {
      payload: { token: userId },
      iat,
    } = decoded as AccessPayload;

    // Get the currently logged in user
    const currentUser = await User.findById(userId);
    const existingtoken = await Token.findOne({ userId });
    // Check if user exist.
    if (!currentUser) {
      throw new AppError.UnAuthenticatedError(
        'User with this credentials no longer exist.'
      );
    }
    // Check if user has not been banned from using the app.
    if (!existingtoken?.isValid) {
      throw new AppError.UnAuthenticatedError(
        'Your access to this app has been restricted.Please contact admin.'
      );
    }

    // Check if there is a recent password change.
    if (currentUser.detectPasswordChange(iat)) {
      throw new AppError.UnAuthenticatedError(
        'Password change detected. Please login again.'
      );
    }

    utils.sendCookies({
      res,
      token: currentUser.id,
      refresh: existingtoken.refreshToken,
    });

    req.user = currentUser;

    return next();
  }

  const decode = await utils.verifyJWT(refreshToken);
  const {
    payload: { token: userId, refresh },
    iat,
  } = decode as RefreshPayload;

  // Get the currently logged in user
  const currentUser = await User.findById(userId);
  const existingtoken = await Token.findOne({ userId, refreshToken: refresh });
  // Check if user exist.
  if (!currentUser) {
    throw new AppError.UnAuthenticatedError(
      'User with this credentials no longer exist.'
    );
  }
  // Check if user has not been banned from using the app.
  if (!existingtoken?.isValid) {
    throw new AppError.UnAuthenticatedError(
      'Your access to this app has been restricted.Please contact admin.'
    );
  }

  // Check if there is a recent password change.
  if (currentUser.detectPasswordChange(iat)) {
    throw new AppError.UnAuthenticatedError(
      'Password change detected. Please login again.'
    );
  }

  utils.sendCookies({
    res,
    token: currentUser.id,
    refresh: existingtoken.refreshToken,
  });

  req.user = currentUser;

  next();
};

export const restrictTo = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Check if role of the currently logged in user have permission to view the route.

    if (req.user && !roles.includes(req.user.role)) {
      throw new AppError.UnAuthorizedError(
        'Page not found on our server here.'
      );
    }
    next();
  };
};

export const checkAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get list of routes users have access to from access db with the already logged in user.
  const accessList = await AccessDb.findOne({ userId: req.user!.id });
  // Check if the currently logged in user have permission to view the route.
  const invalidAccess = !accessList?.permittedRoutes.includes(
    utils.getPathText(req.baseUrl) as string
  );
  if (invalidAccess) {
    throw new AppError.NotFoundError('Page not found on our server here.');
  }
  next();
};

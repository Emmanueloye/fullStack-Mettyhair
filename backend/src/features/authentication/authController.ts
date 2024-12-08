import { NextFunction, Request, Response } from 'express';
import * as authService from './authService';
import Token from './tokenModel';
import { IUser } from './userModel';
import statusCodes from '../../errors/statusCodes';
import * as utils from '../../utils';

/*================================================================================================
===================================Controllers Handlers===========================================
================================================================================================*/

// Signup handler
export const signup = async (req: Request<{}, {}, IUser>, res: Response) => {
  // Create a copy of request body
  const userData = { ...req.body };

  // Call authservice to create user
  await authService.createUser(userData);

  //   Send response back to the user.
  res.status(statusCodes.CREATED).json({
    status: 'success',
    message:
      'Please check your email for your verification email. You will not be able to sign in without verifying your email.',
  });
};

// Verify email handler
export const verifyEmail = async (req: Request, res: Response) => {
  // Create a copy of request body
  const userData = { ...req.body };

  // Call authservice to create user
  await authService.verifyUserEmail(userData);

  res.status(statusCodes.OK).json({
    status: 'success',
    message:
      'Email verified. Welcome to the queens community. Please proceed to login.',
  });
};

// login handler
export const login = async (req: Request, res: Response) => {
  const userData = { ...req.body };
  // Call authservice to login user
  await authService.loginUser(userData, req, res);
};

// forget password handler
export const forgetPassword = async (req: Request, res: Response) => {
  const userData = { ...req.body };
  await authService.userForgetPassword(userData);

  // respond to user
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Please check your email for your reset password link.',
  });
};

// reset password handler
export const resetPassword = async (req: Request, res: Response) => {
  const userData = { ...req.body };
  await authService.userResetPassword(userData);

  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Please, login with your new credentials.',
  });
};

// logout user
export const logout = async (req: Request, res: Response) => {
  await Token.deleteOne({ userId: req.user!.id });
  utils.logoutToken(res);
  res.status(statusCodes.NO_CONTENT).json({ status: 'success' });
};

/*================================================================================================
=====================Validation and Params Switching Middlewares==================================
================================================================================================*/
// This middleware make it possible to either set the verification token as the body or the request or as a query params. Whichever one that is present will eventually be set on the req.body.
export const switchParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) req.body.email = req.query.email;
  if (!req.body.token) req.body.token = req.query.token;
  next();
};

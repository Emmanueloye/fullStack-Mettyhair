import { Request, Response } from 'express';
import User from './userModel';
import Token from './tokenModel';
import { IUser } from './userModel';
import * as utils from '../../utils';
import * as AppError from '../../errors/appError';
import statusCodes from '../../errors/statusCodes';

export const createUser = async (userData: IUser) => {
  // Get the specific properties from body
  const { fullName, email, password, confirmPassword } = userData;

  //   Generate email verification token - send plain token to user and save hashed token to the database.
  const [plainToken, hashToken] = utils.generateToken({});

  // Create new user
  await User.create({
    fullName,
    email,
    password,
    confirmPassword,
    emailVerificationToken: hashToken,
  });

  // send verification email
  const url = `${process.env.BASE_URL}/verify-email?email=${email}&token=${plainToken}`;
  const data = { name: fullName.split(' ')[0], email, url };
  await utils.Email.sendVerificationEmail(data);
};

export const verifyUserEmail = async (userData: {
  email: string;
  token: string;
}) => {
  // Get the email and token from the query parameters
  const { email, token } = userData;
  // fetch user with the verification details
  const user = await User.findOne({
    email,
    emailVerificationToken: utils.generateToken({ type: 'hash', token }),
  });
  // check if user is not is not available.
  if (!user) {
    throw new AppError.BadRequestError(
      'Account verification Failed due to invalid credentials.'
    );
  }
  // if user is available, set verification credentials
  user.emailVerificationToken = undefined;
  user.isVerified = true;
  user.verifiedDate = new Date(Date.now());
  await user.save({ validateBeforeSave: false });
};

export const loginUser = async (
  userData: { email: string; password: string },
  req: Request,
  res: Response
) => {
  // get email and password from the body.
  const { email, password } = userData;
  //get user with the email
  const user = await User.findOne({ email }).select('+password');
  // check if user exist and password is correct
  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    throw new AppError.UnAuthenticatedError('Invalid email or password.');
  }
  // check if user email is verified
  if (!user.isVerified) {
    throw new AppError.UnAuthenticatedError(
      'Email is not verified. Please verify your email.'
    );
  }
  // get the user existing refreshtoken from token db
  const existingtoken = await Token.findOne({ userId: user.id });
  // check if the token exist and is valid log user in.
  if (existingtoken) {
    if (!existingtoken.isValid) {
      throw new AppError.UnAuthenticatedError(
        'Your access to this app has been restricted. Please contact the app admin'
      );
    }
    // Login users by sending cookies (access and refresh token) to user
    utils.sendCookies({
      res,
      token: user.id,
      refresh: existingtoken.refreshToken,
    });
    res
      .status(statusCodes.OK)
      .json({ status: 'success', message: 'Login successfully.' });
    return;
  }

  // if no, create a new refresh token and log user in.
  const token = await Token.create({
    refreshToken: utils.generateToken({ type: 'plain' }),
    userId: user.id,
    userIP: req.ip,
    userAgent: req.header('user-agent'),
  });
  utils.sendCookies({ res, token: user.id, refresh: token.refreshToken });
  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'Login successfully.' });
};

export const userForgetPassword = async (userData: { email: string }) => {
  // get email from the body.
  const { email } = userData;
  // get user with the email.
  const user = await User.findOne({ email });
  // if there is user: set passwordreset token, password token expiration.
  if (user) {
    const [plainToken, hashToken] = utils.generateToken({});
    const minutes = 1000 * 60 * Number(process.env.PASSWORD_RESET_EXPIRES);
    try {
      user.passwordResetToken = hashToken;
      user.passwordTokenExpiresAt = new Date(Date.now() + minutes);
      await user.save({ validateBeforeSave: false });
      // send email with password reset link.
      const url = `${process.env.BASE_URL}/reset-password?email=${email}&token=${plainToken}`;
      const data = { name: user.fullName.split(' ').at(0), url, email };
      utils.Email.sendPasswordResetEmail(data);
    } catch (error) {
      // if error, unset the properties set in the try block.
      user.passwordResetToken = undefined;
      user.passwordTokenExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });
    }
  }
};

export const userResetPassword = async (userData: {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}) => {
  // get required fields from body
  const { email, token, password, confirmPassword } = userData;
  // get user with email and valid token (i.e correct and unexpired token)
  const user = await User.findOne({
    email,
    passwordResetToken: utils.generateToken({ type: 'hash', token }),
    passwordTokenExpiresAt: { $gt: Date.now() },
  });

  // Check if user exist
  if (!user) {
    throw new AppError.UnAuthenticatedError(
      'Invalid reset token credentials. Please, start the process again.'
    );
  }

  // if user exist, reset password and set password reset details to undefined.
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordChangedAt = new Date(Date.now());
  user.passwordResetToken = undefined;
  user.passwordTokenExpiresAt = undefined;
  await user.save();
};

import { startSession } from 'mongoose';
import User from '../authentication/userModel';
import AccessDb from '../authentication/accessModel';
import Token from '../authentication/tokenModel';
import * as AppError from '../../errors/appError';

import * as utils from '../../utils';
import { Request } from 'express';

export const createNewAdmin = async (req: Request) => {
  // Create Temporary admin password
  const tempPassword = utils.generateToken({ type: 'plain' }).slice(0, 9);

  // Get requested body from the request body.
  const { fullName, email, role } = req.body;
  await User.create({
    fullName,
    email,
    role,
    isVerified: true,
    verifiedDate: Date.now(),
    password: tempPassword,
    confirmPassword: tempPassword,
  });

  // Email data
  const data = {
    name: fullName.split(' ')[0],
    email,
    password: tempPassword,
  };

  // Send email to the user.
  await utils.Email.sendAdminEmailVerification(data);
};

export const updateUserPassword = async (req: Request) => {
  // Get required information from request body.
  const { oldPassword, newPassword, confirmPassword } = req.body;
  // Get currently logged in user
  const user = await User.findById(req.user!.id).select('+password');
  // Check if the old password is correct.
  if (!(await user?.isPasswordCorrect(oldPassword, user.password))) {
    throw new AppError.BadRequestError('Incorrect password.');
  }

  // If password is correct, update the password.
  user!.password = newPassword;
  user!.confirmPassword = confirmPassword;
  user!.passwordChangedAt = new Date(Date.now());
  await user!.save();
};

export const userReport = async (req: Request) => {
  const [startDate, endDate] = utils.reportDate(req);

  const filterObj = {
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };
  const userQuery = new utils.GetRequestAPI(User.find(filterObj), req.query)
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const users = await userQuery.query;

  const queryReq = new utils.GetRequestAPI(User.find(filterObj), req.query)
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();

  let page;
  if (req.query.page) page = utils.paginateDetails(documentCount, req);

  return { users, page };
};

export const updateUserAccess = async (req: Request) => {
  const { userId, permittedRoutes } = req.body;

  const user = await AccessDb.findOneAndUpdate(
    { userId },
    { permittedRoutes },
    { new: true }
  );

  if (!user) {
    throw new AppError.NotFoundError(
      'We do not have the user resource you are looking for.'
    );
  }
};

export const restrictUser = async (req: Request) => {
  const { restrict } = req.body;
  const isValid = restrict === 'true';
  const restrictedUser = await Token.findOneAndUpdate(
    { userId: req.params.id },
    { isValid },
    { new: true }
  );
  if (!restrictedUser) {
    throw new AppError.BadRequestError(
      'Please wait for the user to logged in to restrict their access to the application.'
    );
  }
};

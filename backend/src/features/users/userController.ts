import { NextFunction, Request, Response } from 'express';
import User from '../authentication/userModel';
import statusCodes from '../../errors/statusCodes';
import * as userService from './userService';
import * as factory from '../../utils/handlerFactory';
import * as utils from '../../utils';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { checkForErrors } from '../../utils/validate';
import { body } from 'express-validator';

// To upload user image using multer.
export const uploadPhoto = utils.upload.single('photo');

// Get all users
export const getUsers = factory.getAll({ Model: User, label: 'users' });

// To create admin user
export const createAdmin = async (req: Request, res: Response) => {
  await userService.createNewAdmin(req);

  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'Admin created successfully' });
};

// To update user password when logged in.
export const updatePassword = async (req: Request, res: Response) => {
  // update user password
  await userService.updateUserPassword(req);

  utils.logoutToken(res);

  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Password updated. Login with your new credentials.',
  });
};

// Get current logged in user
export const getMe = factory.getOne({
  Model: User,
  label: 'user',
  populateOption: { path: 'access' },
});

// Get single user for admin route.
export const getUser = factory.getOne({
  Model: User,
  label: 'user',
  populateOption: { path: 'token', select: 'isValid' },
});

// Update current logged in user.
export const updateLoginUser = factory.updateOne({
  Model: User,
  label: 'user',
  includedFields: ['fullName', 'photo', 'photoPublicId'],
});

// Update current logged in user's address
export const updateUserAddress = factory.updateOne({
  Model: User,
  label: 'user',
  includedFields: ['address', 'phone', 'state', 'country'],
});

// For super-admin only: to update admin module admin will have access to.
export const updateAccess = async (req: Request, res: Response) => {
  await userService.updateUserAccess(req);

  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'Access updated.' });
};

// For super-admin only: to update user role
export const updateUserRole = factory.updateOne({
  Model: User,
  label: 'user',
  includedFields: ['role'],
});

// For super-admin only: to update app access
export const restrictUser = async (req: Request, res: Response) => {
  await userService.restrictUser(req);
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'User access to app has been updated.',
  });
};

// users report for admin route.
export const userReports = async (req: Request, res: Response) => {
  const { users, page } = await userService.userReport(req);
  res
    .status(statusCodes.OK)
    .json({ status: 'success', noHits: users.length, page, users });
};

// user image processing.
export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = await User.findById(req.user!.id);
  // If user does not update image, move on to the next middleware.
  if (!req.file) return next();

  // Instead of saving to file, convert to buffer and then convert it to uri using datauri package before sending to cloudinary.
  const newFile = await sharp(req.file!.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toBuffer();

  if (currentUser?.photoPublicId) {
    await cloudinary.uploader.destroy(currentUser.photoPublicId);
  }

  const file = utils.formatImageURI('jpeg', newFile);

  const resp = await cloudinary.uploader.upload(file as string);

  req.body.photo = resp.secure_url;
  req.body.photoPublicId = resp.public_id;

  next();
};

// Middleware for switching logged in user id with the params.id setup.
export const switchUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.id) {
    if (req.user && req.user.id) {
      req.params.id = req.user.id?.toString();
    }
  }
  next();
};

// Validate user password update.
export const validatePasswordUpdate = checkForErrors([
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password field is required.'),
  body('newPassword').notEmpty().withMessage('New password field is required.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm Password field is required.'),
]);

// Validate admin creation route (admin)
export const validateAdminCreation = checkForErrors([
  body('fullName').notEmpty().withMessage('Full name field is required.'),
  body('email').notEmpty().withMessage('Email field is required.'),
  body('role').notEmpty().withMessage('User role field is required.'),
]);

// Validate address book update.
export const validateAddressBook = checkForErrors([
  body('address').notEmpty().withMessage('Address field cannot be empty.'),
  body('state').notEmpty().withMessage('State field cannot be empty.'),
  body('country').notEmpty().withMessage('Country field cannot be empty.'),
]);

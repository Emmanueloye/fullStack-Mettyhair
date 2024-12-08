import { body } from 'express-validator';
import { checkForErrors } from '../../utils/validate';

/*===============================================================================================
====================================Validation Middlewares======================================
================================================================================================*/

// Ensure that no empty form is submitted to the server.
export const validateLoginInputs = checkForErrors([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email field is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.'),
  body('password').trim().notEmpty().withMessage('Password field is required.'),
]);

// Validate forget password input
export const validateForgetPassInput = checkForErrors([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email field is required.')
    .isEmail()
    .withMessage('Email must be valid email address.'),
]);

// Validate reset password inputs
export const validateResetPassInput = checkForErrors([
  body('password').trim().notEmpty().withMessage('Password field is required.'),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm password must match Password field.'),
]);

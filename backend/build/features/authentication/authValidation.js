"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResetPassInput = exports.validateForgetPassInput = exports.validateLoginInputs = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../../utils/validate");
/*===============================================================================================
====================================Validation Middlewares======================================
================================================================================================*/
// Ensure that no empty form is submitted to the server.
exports.validateLoginInputs = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email field is required.')
        .isEmail()
        .withMessage('Email must be a valid email address.'),
    (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password field is required.'),
]);
// Validate forget password input
exports.validateForgetPassInput = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email field is required.')
        .isEmail()
        .withMessage('Email must be valid email address.'),
]);
// Validate reset password inputs
exports.validateResetPassInput = (0, validate_1.checkForErrors)([
    (0, express_validator_1.body)('password').trim().notEmpty().withMessage('Password field is required.'),
    (0, express_validator_1.body)('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Confirm password must match Password field.'),
]);

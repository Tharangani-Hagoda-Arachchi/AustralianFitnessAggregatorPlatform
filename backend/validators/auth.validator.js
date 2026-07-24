import { body } from "express-validator";

export const registerValidator = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 60 })
        .withMessage('Name must be between 2 and 60 characters'),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
    body('role')
        .optional()
        .isIn(['user', 'owner'])
        .withMessage('Role must be user or owner'), // admin accounts are never self-registered
];

export const forgotPasswordValidator = [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

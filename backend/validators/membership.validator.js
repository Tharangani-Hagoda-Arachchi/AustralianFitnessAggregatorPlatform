import { body } from "express-validator";

export const subscribeValidator = [
  body('planId').isMongoId().withMessage('Valid planId is required'),
];

export const changePlanValidator = [
  body('newPlanId').isMongoId().withMessage('Valid newPlanId is required'),
];

export const createPlanValidator = [
  body('name').trim().notEmpty().withMessage('Plan name is required'),
  body('gym').isMongoId().withMessage('Valid gym id is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('billingCycle')
    .optional()
    .isIn(['monthly', 'quarterly', 'yearly'])
    .withMessage('Invalid billing cycle'),
];

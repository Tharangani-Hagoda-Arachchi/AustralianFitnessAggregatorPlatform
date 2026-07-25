import { body } from "express-validator";

export const createBookingValidator = [
  body('gymClassId').isMongoId().withMessage('Valid gymClassId is required'),
];

export const createClassValidator = [
  body('gym').isMongoId().withMessage('Valid gym id is required'),
  body('name').trim().notEmpty().withMessage('Class name is required'),
  body('startTime').isISO8601().withMessage('startTime must be a valid date'),
  body('endTime').isISO8601().withMessage('endTime must be a valid date'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
];
import { body } from "express-validator";

export const generateQrValidator = [
  body('gymId').isMongoId().withMessage('Valid gymId is required'),
];

export const checkInValidator = [
  body('gymId').isMongoId().withMessage('Valid gymId is required'),
  body('qrToken').notEmpty().withMessage('qrToken is required'),
];

import { body } from "express-validator";

export const createGymValidator = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Gym name is required'),
    body('description').optional().isLength({ max: 2000 }),
    body('location.coordinates')
        .isArray({ min: 2, max: 2 })
        .withMessage('location.coordinates must be [longitude, latitude]'),
    body('location.coordinates.*').isFloat().withMessage('Coordinates must be numbers'),
    body('address.state')
        .optional()
        .isIn(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'])
        .withMessage('Invalid Australian state'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    body('facilities').optional().isArray().withMessage('Facilities must be an array'),
];
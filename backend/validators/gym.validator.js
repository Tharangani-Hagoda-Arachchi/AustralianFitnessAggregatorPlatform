import { body, query } from "express-validator";

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

export const searchGymValidator = [
    query('lat').optional().isFloat().withMessage('lat must be a number'),
    query('lng').optional().isFloat().withMessage('lng must be a number'),
    query('radiusKm').optional().isFloat({ min: 0.1 }).withMessage('radiusKm must be positive'),
    query('facility').optional().isString(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
];
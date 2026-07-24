import express from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { createGym } from "../controllers/gym.controller.js";
import { createGymValidator } from "../validators/gym.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

export const gymRoute = express.Router();

/**
 * @openapi
 * /api/gyms:
 *   post:
 *     summary: Create a new gym
 *     description: Creates a new gym. Only authenticated owners or admins can create gyms.
 *     tags: [Gyms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fitness First Sydney"
 *               description:
 *                 type: string
 *                 example: "A premium fitness center with modern equipment."
 *               location:
 *                 type: object
 *                 required:
 *                   - coordinates
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "Point"
 *                   coordinates:
 *                     type: array
 *                     description: "[longitude, latitude]"
 *                     minItems: 2
 *                     maxItems: 2
 *                     items:
 *                       type: number
 *                     example: [151.2093, -33.8688]
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 George Street"
 *                   suburb:
 *                     type: string
 *                     example: "Sydney"
 *                   state:
 *                     type: string
 *                     enum:
 *                       - NSW
 *                       - VIC
 *                       - QLD
 *                       - WA
 *                       - SA
 *                       - TAS
 *                       - ACT
 *                       - NT
 *                     example: "NSW"
 *                   postcode:
 *                     type: string
 *                     example: "2000"
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "Pool"
 *                   - "Sauna"
 *                   - "Free Weights"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *               pricePerVisit:
 *                 type: number
 *                 example: 20
 *               timetable:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum:
 *                         - Mon
 *                         - Tue
 *                         - Wed
 *                         - Thu
 *                         - Fri
 *                         - Sat
 *                         - Sun
 *                     open:
 *                       type: string
 *                       example: "06:00"
 *                     close:
 *                       type: string
 *                       example: "22:00"
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://example.com/gym.jpg"
 *                     caption:
 *                       type: string
 *                       example: "Main entrance"
 *     responses:
 *       201:
 *         description: Gym created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Gym created successfully.
 *                 gym:
 *                   type: object
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized - JWT token missing or invalid
 *       403:
 *         description: Forbidden - Only owners or admins can create gyms
 *       500:
 *         description: Internal server error
 */
//create new gym route
gymRoute.post('/gyms', protect, requireRole('owner', 'admin'), createGymValidator, validate, createGym);
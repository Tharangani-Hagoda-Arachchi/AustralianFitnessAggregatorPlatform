import express from "express";
import { protect, requireGymOwnership, requireRole } from "../middlewares/auth.middleware.js";
import { createGym, deleteGym, getGymById, getGyms, toggleFavourite, updateGym } from "../controllers/gym.controller.js";
import { createGymValidator, searchGymValidator } from "../validators/gym.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Gym } from "../models/gym.model.js";

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

/**
 * @openapi
 * /api/gyms:
 *   get:
 *     summary: Search and filter gyms
 *     description: Search approved and active gyms by keyword, facility, price range, and nearby location.
 *     tags: [Gyms]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search gym by name or description
 *         example: Fitness
 *
 *       - in: query
 *         name: facility
 *         schema:
 *           type: string
 *         description: Filter gyms by facility
 *         example: Pool
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per visit
 *         example: 10
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per visit
 *         example: 50
 *
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for nearby gym search
 *         example: -33.8688
 *
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude for nearby gym search
 *         example: 151.2093
 *
 *       - in: query
 *         name: radiusKm
 *         schema:
 *           type: number
 *           default: 10
 *         description: Search radius in kilometers
 *         example: 5
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of gyms per page
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Gyms fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 gyms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66a123456789abcdef"
 *                       name:
 *                         type: string
 *                         example: "Fitness First Sydney"
 *                       description:
 *                         type: string
 *                         example: "Premium fitness centre with modern equipment"
 *                       facilities:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example:
 *                           - Pool
 *                           - Sauna
 *                       pricePerVisit:
 *                         type: number
 *                         example: 20
 *                       rating:
 *                         type: object
 *                         properties:
 *                           average:
 *                             type: number
 *                             example: 4.5
 *                           count:
 *                             type: integer
 *                             example: 120
 *                       location:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: Point
 *                           coordinates:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example:
 *                               - 151.2093
 *                               - -33.8688
 *
 *       400:
 *         description: Invalid search parameters
 *
 *       500:
 *         description: Internal server error
 */
//search gym route
gymRoute.get('/gyms', getGyms);

/**
 * @openapi
 * /api/gyms/{id}:
 *   get:
 *     summary: Get gym by ID
 *     description: Retrieve the details of a specific gym using its MongoDB ObjectId.
 *     tags: [Gyms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *         example: "689d7d98a123456789abcdef"
 *     responses:
 *       200:
 *         description: Gym fetched successfully
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
 *                   example: Gym fetched successfully
 *                 gym:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "689d7d98a123456789abcdef"
 *                     name:
 *                       type: string
 *                       example: "Fitness First Sydney"
 *                     description:
 *                       type: string
 *                       example: "Premium fitness centre with modern equipment."
 *                     owner:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "689d7c98a123456789abcdef"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john@example.com"
 *                     location:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "Point"
 *                         coordinates:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [151.2093, -33.8688]
 *                     facilities:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - Pool
 *                         - Sauna
 *                     pricePerVisit:
 *                       type: number
 *                       example: 20
 *                     status:
 *                       type: string
 *                       example: approved
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *
 *       400:
 *         description: Invalid gym ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid gym ID
 *
 *       404:
 *         description: Gym not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Gym not found
 *
 *       500:
 *         description: Internal server error
 */
//serch gym by id
gymRoute.get('/gyms/:id', getGymById);

/**
 * @openapi
 * /api/gyms/{id}:
 *   put:
 *     summary: Update gym details
 *     tags: [Gyms]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *           example: "66a123456789abcdef"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fitness First Gym"
 *
 *               description:
 *                 type: string
 *                 example: "Modern fitness centre with advanced equipment"
 *
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "Point"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example:
 *                       - 151.2093
 *                       - -33.8688
 *
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "George Street"
 *                   suburb:
 *                     type: string
 *                     example: "Sydney"
 *                   state:
 *                     type: string
 *                     example: "NSW"
 *                   postcode:
 *                     type: string
 *                     example: "2000"
 *
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Pool
 *                   - Sauna
 *                   - Free weights
 *
 *               capacity:
 *                 type: number
 *                 example: 100
 *
 *               pricePerVisit:
 *                 type: number
 *                 example: 20
 *
 *               isActive:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Gym updated successfully
 *
 *       400:
 *         description: Validation failed or invalid gym ID
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - User does not own this gym
 *
 *       404:
 *         description: Gym not found
 *
 *       500:
 *         description: Internal server error
 */

//updte gym by id
gymRoute.put('/gyms/:id', protect, requireRole('owner', 'admin'), requireGymOwnership(Gym), updateGym);

/**
 * @openapi
 * /api/gyms/{id}:
 *   delete:
 *     summary: Delete gym
 *     tags: [Gyms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *           example: "689d7d98a123456789abcdef"
 *
 *     responses:
 *       200:
 *         description: Gym deleted successfully
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
 *                   example: Gym deleted successfully
 *
 *       400:
 *         description: Invalid gym ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid gym ID
 *
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *
 *       403:
 *         description: Forbidden - User does not have permission to delete this gym
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *
 *       404:
 *         description: Gym not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Gym not found
 *
 *       500:
 *         description: Internal server error
 */


// Delete gym route
gymRoute.delete('/gyms/:id', protect, requireRole('owner', 'admin'), requireGymOwnership(Gym), deleteGym);

/**
 * @openapi
 * /api/gyms/{id}/favourite:
 *   post:
 *     summary: Toggle favourite gym
 *     tags: [Gyms]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Favourite status updated successfully
 *
 *       404:
 *         description: Gym not found
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       500:
 *         description: Internal server error
 */

// Toggle favourite gym
gymRoute.post('/gyms/:id/favourite', protect, toggleFavourite);
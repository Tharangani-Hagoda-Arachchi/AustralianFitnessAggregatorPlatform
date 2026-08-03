import express from "express";
import { cancelBooking, createBooking, createClass, getClassesForGym, getMyBookings } from "../controllers/booking.controller.js";
import { protect, requireGymOwnership, requireRole } from "../middlewares/auth.middleware.js";
import { createBookingValidator, createClassValidator } from "../validators/booking.validate.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateQrToken } from "../utils/qrService.js";
import { Gym } from "../models/gym.model.js";

export const gymClassRoute = express.Router();


/**
 * @openapi
 * /api/classes/gym/{gymId}:
 *   get:
 *     summary: Get upcoming classes for a gym
 *     tags: [Classes]
 *
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *           example: "689d7d98a123456789abcdef"
 *
 *     responses:
 *       200:
 *         description: Classes fetched successfully
 *
 *       404:
 *         description: Gym not found
 *
 *       500:
 *         description: Internal server error
 */

// Get classes for gym
gymClassRoute.get( "/classes/gym/:gymId", getClassesForGym);

/**
 * @openapi
 * /api/classes:
 *   post:
 *     summary: Create a gym class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gym
 *               - name
 *               - startTime
 *               - endTime
 *
 *             properties:
 *               gym:
 *                 type: string
 *                 example: "689d7d98a123456789abcdef"
 *
 *               name:
 *                 type: string
 *                 example: "Morning Yoga"
 *
 *               instructor:
 *                 type: string
 *                 example: "John Smith"
 *
 *               startTime:
 *                 type: string
 *                 example: "2026-08-01T06:00:00.000Z"
 *
 *               endTime:
 *                 type: string
 *                 example: "2026-08-01T07:00:00.000Z"
 *
 *               capacity:
 *                 type: number
 *                 example: 20
 *
 *     responses:
 *       201:
 *         description: Class created successfully
 *
 *       400:
 *         description: Invalid time range
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       500:
 *         description: Internal server error
 */

// Create class (owner/admin)
gymClassRoute.post("/classes", protect, requireRole("owner", "admin"),requireGymOwnership(Gym), createClassValidator, validate, createClass);


/**
 * @openapi
 * /api/bookings:
 *   post:
 *     summary: Book a gym class
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gymClassId
 *
 *             properties:
 *               gymClassId:
 *                 type: string
 *                 example: "689d7d98a123456789abcdef"
 *
 *     responses:
 *       201:
 *         description: Class booked successfully
 *
 *       400:
 *         description: Class is not available
 *
 *       404:
 *         description: Class not found
 *
 *       409:
 *         description: Class fully booked or already booked
 *
 *       500:
 *         description: Internal server error
 */

// Create booking
gymClassRoute.post("/bookings", protect, createBookingValidator, validate, createBooking);





/**
 * @openapi
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *           example: "689d7d98a123456789abcdef"
 *
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *
 *       400:
 *         description: Booking is not active
 *
 *       404:
 *         description: Booking not found
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */

// Cancel booking
gymClassRoute.put("/bookings/:id/cancel", protect, cancelBooking);
 
/**
 * @openapi
 * /api/bookings/me:
 *   get:
 *     summary: Get logged-in user's bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */

// Get my bookings
gymClassRoute.get("/bookings/me", protect, getMyBookings);




import express from "express";
import { protect, requireGymOwnership, requireRole } from "../middlewares/auth.middleware.js";
import { generateQrPass } from "../controllers/qr.controller.js";
import { checkInValidator, generateQrValidator } from "../validators/checkin.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { checkIn, getGymCheckinsToday, getMyCheckinHistory } from "../controllers/checkin.controller.js";
import { Gym } from "../models/gym.model.js";


export const checkinRouter = express.Router();

/**
 * @openapi
 * /api/qr/generate:
 *   post:
 *     summary: Generate QR pass for gym check-in
 *     tags: [QR]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gymId
 *             properties:
 *               gymId:
 *                 type: string
 *                 example: "689d7d98a123456789abcdef"
 *     responses:
 *       200:
 *         description: QR pass generated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */

// Generate QR Pass
checkinRouter.post("/qr/generate", protect, generateQrValidator, validate, generateQrPass);


/**
 * @openapi
 * /api/checkins:
 *   post:
 *     summary: Check in to a gym using QR code
 *     tags: [Check-in]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gymId
 *               - qrToken
 *             properties:
 *               gymId:
 *                 type: string
 *                 example: "689d7d98a123456789abcdef"
 *               qrToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       201:
 *         description: Checked in successfully
 *       400:
 *         description: Invalid QR token
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gym not found
 *       409:
 *         description: Already checked into another gym today
 *       500:
 *         description: Internal server error
 */

// Check in
checkinRouter.post("/checkins", protect,checkInValidator, validate, checkIn);


/**
 * @openapi
 * /api/checkins/history:
 *   get:
 *     summary: Get logged-in user's check-in history
 *     tags: [Check-in]
 *     responses:
 *       200:
 *         description: Check-in history fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

// Get my check-in history
checkinRouter.get("/checkins/history", protect, getMyCheckinHistory);


/**
 * @openapi
 * /api/checkins/gym/{gymId}:
 *   get:
 *     summary: Get today's check-ins for a gym
 *     tags: [Check-in]
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *           example: "689d7d98a123456789abcdef"
 *     responses:
 *       200:
 *         description: Today's check-ins fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */

// Get today's gym check-ins
checkinRouter.get("/checkins/gym/:gymId", protect, requireRole("owner", "admin"), requireGymOwnership(Gym), getGymCheckinsToday);


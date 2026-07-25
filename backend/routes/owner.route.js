import express from "express";
import { protect, requireGymOwnership, requireRole } from "../middlewares/auth.middleware.js";
import { Gym } from "../models/gym.model.js";
import { getGymAnalytics, getMyGyms } from "../controllers/owner.controller.js";

export const ownerRoute = express.Router();
/**
 * @openapi
 * /api/gyms/{gymId}/analytics:
 *   get:
 *     summary: Get gym analytics
 *     tags: [Owner]
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: from
 *         required: false
 *         description: Start date filter
 *         schema:
 *           type: string
 *           example: "2026-01-01"
 *
 *       - in: query
 *         name: to
 *         required: false
 *         description: End date filter
 *         schema:
 *           type: string
 *           example: "2026-01-31"
 *
 *     responses:
 *       200:
 *         description: Gym analytics fetched successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - Not gym owner
 *
 *       404:
 *         description: Gym not found
 *
 *       500:
 *         description: Internal server error
 */
ownerRoute.get('/gyms/:gymId/analytics',protect, requireRole('owner', 'admin'), requireGymOwnership(Gym), getGymAnalytics);

/**
 * @openapi
 * /api/owner/gyms:
 *   get:
 *     summary: Get owner's gyms
 *     tags: [Owner]
 *
 *     responses:
 *       200:
 *         description: Owner gyms fetched successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - Owner access required
 *
 *       500:
 *         description: Internal server error
 */
ownerRoute.get('/owner/gyms', protect, requireRole('owner'), getMyGyms);
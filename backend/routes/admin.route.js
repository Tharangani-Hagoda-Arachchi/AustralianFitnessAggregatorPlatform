import express from "express";
import { protect, requireRole } from "../middlewares/auth.middleware";
import { getAllUsers } from "../controllers/admin.controller";

export const adminRoute = express.Router();

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: role
 *         required: false
 *         description: Filter users by role
 *         schema:
 *           type: string
 *           enum:
 *             - user
 *             - owner
 *             - admin
 *
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of users per page
 *         schema:
 *           type: integer
 *           example: 20
 *
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - Admin access required
 *
 *       500:
 *         description: Internal server error
 */

// Get all users route
adminRoute.get('/users', protect, requireRole('admin'), getAllUsers);
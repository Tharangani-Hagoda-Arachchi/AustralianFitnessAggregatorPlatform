import express from "express";
import { protect, requireRole } from "../middlewares/auth.middleware.js";
import { approveGym, getAllGyms, getAllPayments, getAllUsers, getPlatformOverview, rejectGym, updateUserStatus } from "../controllers/admin.controller.js";

export const adminRoute = express.Router();

/**
 * @openapi
 * /api/users:
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

/**
 * @openapi
 * /api/admin/gyms:
 *   get:
 *     summary: Get all gyms
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter gyms by status
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - approved
 *             - rejected
 *             - suspended
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
 *         description: Number of gyms per page
 *         schema:
 *           type: integer
 *           example: 20
 *
 *     responses:
 *       200:
 *         description: Gyms fetched successfully
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

// Get all gyms route
adminRoute.get('/admin/gyms', protect, requireRole('admin'), getAllGyms);

/**
 * @openapi
 * /api/users/{id}/status:
 *   put:
 *     summary: Update user active status
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: "689d7d98a123456789abcdef"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *
 *     responses:
 *       200:
 *         description: User status updated successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - Admin access required
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */

// Update user status route
adminRoute.put('/users/:id/status', protect, requireRole('admin'), updateUserStatus);

/**
 * @openapi
 * /api/gyms/{id}/approve:
 *   put:
 *     summary: Approve gym
 *     tags: [Admin]
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
 *         description: Gym approved successfully
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
 *                   example: Gym approved successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - Admin access required
 *
 *       404:
 *         description: Gym not found
 *
 *       500:
 *         description: Internal server error
 */

// Approve gym route
adminRoute.put('/gyms/:id/approve', protect, requireRole('admin'), approveGym);

/**
 * @openapi
 * /api/gyms/{id}/reject:
 *   put:
 *     summary: Reject gym
 *     tags: [Admin]
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
 *         description: Gym rejected successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - Admin access required
 *
 *       404:
 *         description: Gym not found
 *
 *       500:
 *         description: Internal server error
 */

//reject gym route
adminRoute.put('/gyms/:id/reject', protect, requireRole('admin'), rejectGym);

/**
 * @openapi
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter payments by status
 *         schema:
 *           type: string
 *           example: succeeded
 *
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *
 *     responses:
 *       200:
 *         description: Payments fetched successfully
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

//get all payments
adminRoute.get('/payments', protect, requireRole('admin'), getAllPayments);

/**
 * @openapi
 * /api/reports/overview:
 *   get:
 *     summary: Get platform overview
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Platform overview fetched successfully
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

//report overview route
adminRoute.get( '/reports/overview', protect, requireRole('admin'), getPlatformOverview);
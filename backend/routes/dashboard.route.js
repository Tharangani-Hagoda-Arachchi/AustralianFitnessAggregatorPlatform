import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getUserDashboard } from "../controllers/dashboard.controller.js";


 export const dashboardRouter = express.Router();

/**
 * @openapi
 * /api/dashboard/me:
 *   get:
 *     summary: Get logged-in user's dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully
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
 *                   example: Dashboard fetched successfully
 *                 dashboard:
 *                   type: object
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       500:
 *         description: Internal server error
 */

// Get logged-in user's dashboard
dashboardRouter.get("/dashboard/me", protect, getUserDashboard);


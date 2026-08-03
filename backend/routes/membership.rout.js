import express from "express";
import { protect, requireGymOwnership, requireRole } from "../middlewares/auth.middleware.js";
import { cancelMembership, changePlan, createPlan, getMyMembership, getPlansForGym, subscribe } from "../controllers/membership.controller.js";
import { changePlanValidator, createPlanValidator, subscribeValidator } from "../validators/membership.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Gym } from "../models/gym.model.js";


export const membershipRoute = express.Router();
/**
 * @openapi
 * /api/plans/{gymId}:
 *   get:
 *     summary: Get membership plans for a gym
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: gymId
 *         required: true
 *         description: Gym ID
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Membership plans fetched successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       500:
 *         description: Internal server error
 */
membershipRoute.get('/plans/:gymId', protect, getPlansForGym);

/**
 * @openapi
 * /api/plans:
 *   post:
 *     summary: Create membership plan
 *     tags: [Memberships]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gym
 *               - name
 *               - price
 *               - billingCycle
 *             properties:
 *               gym:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               billingCycle:
 *                 type: string
 *                 enum:
 *                   - monthly
 *                   - quarterly
 *                   - yearly
 *               perks:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *     responses:
 *       201:
 *         description: Membership plan created successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       403:
 *         description: Forbidden - Owner/Admin access required
 *
 *       500:
 *         description: Internal server error
 */
membershipRoute.post('/plans', protect, requireRole('owner', 'admin'), requireGymOwnership(Gym), createPlanValidator, validate, createPlan);

/**
 * @openapi
 * /api/me/plans:
 *   get:
 *     summary: Get logged-in user's active membership
 *     tags: [Memberships]
 *
 *     responses:
 *       200:
 *         description: Membership fetched successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       500:
 *         description: Internal server error
 */

membershipRoute.get("/me/plans", protect,getMyMembership);

/**
 * @openapi
 * /api/plans/subscribe:
 *   post:
 *     summary: Subscribe to a membership plan
 *     tags: [Memberships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 example: "689d7d98a123456789abcdef"
 *
 *     responses:
 *       201:
 *         description: Membership subscribed successfully
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       404:
 *         description: Plan not found or inactive
 *
 *       409:
 *         description: User already has an active membership
 *
 *       500:
 *         description: Internal server error
 */
membershipRoute.post("/plans/subscribe", protect, subscribeValidator, validate, subscribe);

/**
 * @openapi
 * /api/plans/{id}/change-plan:
 *   put:
 *     summary: Change membership plan
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Membership ID
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPlanId
 *             properties:
 *               newPlanId:
 *                 type: string
 *                 example: "689d7d98a123456789abcdef"
 *
 *     responses:
 *       200:
 *         description: Membership plan changed successfully
 *
 *       400:
 *         description: Invalid membership or different gym plan
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       404:
 *         description: Membership or plan not found
 *
 *       500:
 *         description: Internal server error
 */
membershipRoute.put("/plans/:id/change-plan", protect, changePlanValidator, validate, changePlan);

/**
 * @openapi
 * /api/plans/{id}/cancel:
 *   put:
 *     summary: Cancel membership
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Membership ID
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Membership cancelled successfully
 *
 *       400:
 *         description: Membership is not active
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *
 *       404:
 *         description: Membership not found
 *
 *       500:
 *         description: Internal server error
 */
membershipRoute.put("/plans/:id/cancel", protect, cancelMembership);
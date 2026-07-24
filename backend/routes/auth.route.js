import express from "express";
import { forgotPasswordValidator, registerValidator, resetPasswordValidator } from "../validators/auth.validator.js";
import { forgetPassword, getUserProfile, resetPassword, userLogin, userRegister } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

export const authRoute = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfuly
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Email already registered
 */
//user registration route
authRoute.post('/auth/register', registerValidator, validate, userRegister);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successfull
 *       401:
 *         description: Invalid credentials
 */
//user loginn route
authRoute.post('/auth/login', userLogin);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get logged-in user profile
 *     description: Returns the profile of the authenticated user using the JWT token provided in the Authorization header.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized. Missing or invalid JWT token.
 *       404:
 *         description: User not found.
 */
//get loged user
authRoute.get('/auth/me', protect, getUserProfile);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset link to the user's email if the account exists.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Password reset request processed successfully.
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
 *                   example: If an account exists for this email, a reset link has been sent.
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
//forget password
authRoute.post('/auth/forgot-password', forgotPasswordValidator, validate, forgetPassword);


/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using the reset token received via email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token received via email
 *                 example: "8d5a2d8b9d7d2f8d7e5c3b1a9f6e4d2c"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "NewPassword123@"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Reset token is invalid or has expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset token is invalid or has expired.
 *       500:
 *         description: Internal server error
 */
//reset password
authRoute.post('/auth/reset-password', resetPasswordValidator, validate, resetPassword);
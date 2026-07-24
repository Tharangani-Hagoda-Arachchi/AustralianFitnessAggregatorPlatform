import express from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { userLogin, userRegister } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

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
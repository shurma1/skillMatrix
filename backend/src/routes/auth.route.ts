import express from 'express';
import AuthController from "../controllers/auth.controller";

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login with identifier and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestDTO'
 *     responses:
 *       200:
 *         description: Tokens and user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthDTO'
 *       401:
 *         description: Invalid credentials
 */
router.post(
	'/login',
	AuthController.login
);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequestDTO'
 *     responses:
 *       200:
 *         description: New token pair
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenDTO'
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
	'/refresh',
	AuthController.refresh
);

export default router;

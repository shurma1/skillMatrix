import express from 'express';
import TestController from '../controllers/test.controller';
import {createTest} from "../schemas/test/createTest";
import {validateSchema} from "../middlewares/validateSchema.middleware";
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router({ mergeParams: true });

/**
 * @openapi
 * /api/test:
 *   post:
 *     summary: Create a test for skill
 *     tags:
 *       - Test
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreateTestDTO'
 *               - type: object
 *                 properties:
 *                   skillId: { type: string }
 *     responses:
 *       200:
 *         description: Created test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestDTO'
 */
router.post(
	'/',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	validateSchema(createTest()),
	TestController.createTest
);
/**
 * @openapi
 * /api/test/start:
 *   post:
 *     summary: Start test session
 *     tags:
 *       - Test
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StartTestDTO'
 *     responses:
 *       200:
 *         description: Session started
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StartTestResponseDTO'
 */
router.post(
	'/start',
	permissionMiddleware({
		needAuth: true,
	}),
	TestController.startTest
);
/**
 * @openapi
 * /api/test/end:
 *   post:
 *     summary: End test session
 *     tags:
 *       - Test
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EndTestDTO'
 *     responses:
 *       200:
 *         description: Ended
 */
router.post(
	'/end',
	permissionMiddleware({
		needAuth: true,
	}),
	TestController.endTest
);
/**
 * @openapi
 * /api/test/sendAnswer:
 *   post:
 *     summary: Send answer for question
 *     tags:
 *       - Test
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendAnswerDTO'
 *     responses:
 *       200:
 *         description: Current result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTestResultDTO'
 */
router.post(
	'/sendAnswer',
	permissionMiddleware({
		needAuth: true,
	}),
	TestController.sendAnswer
);

/**
 * @openapi
 * /api/test/{testId}/result:
 *   get:
 *     summary: Get test result by test session id
 *     tags:
 *       - Test
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User test result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTestResultDTO'
 */
router.get(
	'/:testId/result',
	permissionMiddleware({
		needAuth: true,
	}),
	TestController.getUserTestResult
);
/**
 * @openapi
 * /api/test/{testId}:
 *   get:
 *     summary: Get test by id
 *     tags:
 *       - Test
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreviewTestDto'
 */
router.get(
	'/:testId',
	permissionMiddleware({
		needAuth: true,
	}),
	TestController.getTest
);

export default router;

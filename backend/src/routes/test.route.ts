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
 * /api/test/{testId}/result/user/{userId}:
 *   get:
 *     summary: Get test result for a specific user
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
 *       - in: path
 *         name: userId
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
	'/:testId/result/user/:userId',
	permissionMiddleware({ needAuth: true }),
	TestController.getUserTestResultByUser
);

/**
 * @openapi
 * /api/test/{testId}/result/user/{userId}:
 *   delete:
 *     summary: Delete a specific user's test result
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
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete(
	'/:testId/result/user/:userId',
	permissionMiddleware({ needAuth: true }),
	TestController.deleteUserTestResult
);

/**
 * @openapi
 * /api/test/{testId}/can-delete:
 *   get:
 *     summary: Check if current user can delete the test
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
 *         description: Whether the user can delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 can:
 *                   type: boolean
 */
router.get(
	'/:testId/can-delete',
	permissionMiddleware({ needAuth: true }),
	TestController.canDeleteTest
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

/**
 * @openapi
 * /api/test/{testId}/full:
 *   get:
 *     summary: Get full test with questions and answers
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
 *         description: Full Test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestDTO'
 */
router.get(
	'/:testId/full',
	permissionMiddleware({ 
		needAuth: true,
		permission: ['VIEW_ALL'] 
	}),
	TestController.getTestFull
);

/**
 * @openapi
 * /api/test/{testId}:
 *   put:
 *     summary: Update a test (title, needScore, timeLimit, questions)
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
 *             $ref: '#/components/schemas/CreateTestDTO'
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated test
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestDTO'
 */
router.put(
	'/:testId',
	permissionMiddleware({ needAuth: true, permission: ['EDIT_ALL'] }),
	TestController.updateTest
);

export default router;

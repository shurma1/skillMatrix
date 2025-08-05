import express from 'express';
import UserController from '../controllers/user.controller';
import {validateSchema} from "../middlewares/validateSchema.middleware";
import {createUser} from "../schemas/user/createUser";
import {updateUser} from "../schemas/user/updateUser";
import {checkID} from "../schemas/common/checkID";

const router = express.Router();

/**
 * @openapi
 * /api/user/search:
 *   get:
 *     summary: Search users
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDTO'
 */
router.get(
	'/search',
	UserController.search
);

/**
 * @openapi
 * /api/user:
 *   post:
 *     summary: Create a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 */
router.post(
	'/',
	validateSchema(createUser()),
	UserController.create
);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: User not found
 */
router.get(
	'/:id',
	validateSchema(checkID(), ['params']),
	UserController.getByID
);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     summary: Update user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: User not found
 */
router.put(
	'/:id',
	validateSchema(checkID(), ['params']),
	validateSchema(updateUser()),
	UserController.update
);


/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete(
	'/:id',
	validateSchema(checkID(), ['params']),
	UserController.delete
);

router.get('/:id/skill/', UserController.getAllSkills);

router.post('/:id/skill/', UserController.addSkill);

router.get('/:id/skill/:skillId', UserController.getSkill);

router.put('/:id/skill/:skillId', UserController.updateSkill);

router.delete('/:id/skill/:skillId', UserController.deleteSkill);



router.get('/:id/jobrole/', UserController.getAllJobRoles);

router.get('/:id/jobrole/:jobroleId/skill', UserController.getAllSkillsByJobrole)

router.post('/:id/jobrole/', UserController.addJobrole);

router.delete('/:id/jobrole/:jobroleId', UserController.deleteJobrole);



router.get('/:id/skill/:skillId/confirmation', UserController.getConfirmations);

router.post('/:id/skill/:skillId/confirmation', UserController.addConfirmation);

router.delete('/:id/skill/:skillId/confirmation/:confirmationId', UserController.deleteConfirmation);

export default router;

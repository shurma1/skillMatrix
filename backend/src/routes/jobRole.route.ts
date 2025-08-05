import express from 'express';
import JobRoleController from '../controllers/jobRole.controller';

const router = express.Router();

router.get('/search', JobRoleController.search);

router.post('/', JobRoleController.create);

router.get('/:id', JobRoleController.getByID);

router.put('/:id', JobRoleController.update);

router.delete('/:id', JobRoleController.delete);


router.get('/:id/user', JobRoleController.getUsers);

router.post('/:id/user', JobRoleController.addUser);

router.delete('/:id/user/:userId', JobRoleController.deleteUser);


router.get('/:id/skill', JobRoleController.getSkills);

router.post('/:id/skill', JobRoleController.addSkill);

router.put('/:id/skill/:skillId', JobRoleController.updateSkill);

router.delete('/:id/skill/:skillId', JobRoleController.deleteSkill);

export default router;

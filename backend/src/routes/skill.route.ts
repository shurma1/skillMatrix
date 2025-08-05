import express from 'express';
import SkillController from "../controllers/skill.controller";

const router = express.Router();

router.get('/search', SkillController.search);

router.post('/', SkillController.create);

router.delete('/:id', SkillController.delete);

router.put('/:id', SkillController.update);

router.get('/:id', SkillController.get);


router.get('/:id/user', SkillController.getAllUsers)


router.post('/:id/tag', SkillController.addTag);

router.get('/:id/tags', SkillController.create);

router.delete('/:id/tag/:tagId', SkillController.deleteTag);


router.post('/:id/version', SkillController.createVersion);

router.get('/:id/version', SkillController.getVersions);

router.get('/:id/version/:versionId', SkillController.getVersion);

router.delete('/:id/version/:versionId', SkillController.deleteVersion);

export default router;

import express from 'express';
import TagController from '../controllers/tag.controller';

const router = express.Router();

router.get('/search', TagController.search);

router.get('/:id', TagController.get);

router.post('/', TagController.create);

router.put('/:id', TagController.update);

router.delete('/:id', TagController.delete);

export default router;

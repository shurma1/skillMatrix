import { Request, Response, NextFunction } from 'express';
import TagService from '../services/tag.service';
import { TagCreateDTO, TagUpdateDTO } from '../dtos/tag.dto';

class TagController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { name } = req.body as TagCreateDTO;
			const tag = await TagService.create({ name });
			res.status(200).json(tag);
		} catch (err) {
			next(err);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { name } = req.body as TagUpdateDTO;
			const tag = await TagService.update(id, { name });
			res.json(tag);
		} catch (err) {
			next(err);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await TagService.delete(id);
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}

	async get(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const tag = await TagService.get(id);
			res.json(tag);
		} catch (err) {
			next(err);
		}
	}

	async search(req: Request, res: Response, next: NextFunction) {
		try {
			const { query } = req.query;
			const decodedQuery = decodeURIComponent(query as string);
			const tags = await TagService.search(decodedQuery);
			res.json(tags);
		} catch (err) {
			next(err);
		}
	}
}

export default new TagController();

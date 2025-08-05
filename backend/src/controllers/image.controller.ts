import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/image.service';

class ImageController {
	async upload(req: Request, res: Response, next: NextFunction) {
		try {
			const imageInfo = await ImageService.upload(req.file);
			
			res.status(201).send(imageInfo);
		} catch (err) {
			next(err);
		}
	}

	async get(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const isThumb = req.query.thumb === 'true';
			
			const imagePath = await ImageService.getImagePath(id, isThumb);
			
			res.sendFile(imagePath);
		} catch (err) {
			next(err);
		}
	}
	
	async getInfo(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const imageInfo = await ImageService.getInfo(id);
			
			res.send(imageInfo);
		} catch (err) {
			next(err);
		}
	}
	
}

export default new ImageController();

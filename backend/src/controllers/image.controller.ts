import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/image.service';
import path from 'path';
import ImageRepository from '../repositories/Image.repository';
import fs from 'fs';
import {ImageDTO} from "../dtos/Image.dto";
import imageRepository from "../repositories/Image.repository";
import {isImageMimeType} from "../utils/isImageMimeType";


class ImageController {
	async upload(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.file) {
				return res.status(400).json({ error: 'No file uploaded' });
			}
			
			const originalPath = req.file.path;
			
			if(! isImageMimeType(req.file.mimetype)) {
				fs.unlinkSync(originalPath);
				return res.status(500).json({ error: 'mime type not supported' });
			}
			
			const ext = '.webp';
			const webpFilename = path.basename(originalPath, path.extname(originalPath)) + ext;
			const webpPath = path.resolve(path.dirname(originalPath), webpFilename);
			const thumbFilename = path.basename(originalPath, path.extname(originalPath)) + '_thumb' + ext;
			const thumbPath = path.resolve(path.dirname(originalPath), thumbFilename);

			const converted = await ImageService.convertToWEBP(originalPath, webpPath);
			if (!converted) {
				return res.status(500).json({ error: 'Failed to convert to webp' });
			}
			const thumbCreated = await ImageService.createThumbnail(webpPath, thumbPath);
			if (!thumbCreated) {
				return res.status(500).json({ error: 'Failed to create thumbnail' });
			}

			fs.unlinkSync(originalPath);
			const metadata = await ImageService.getMetadata(webpPath);
			const width = metadata.width || 0;
			const height = metadata.height || 0;
			
			const image = await ImageRepository.create(width, height, webpFilename, thumbFilename, 'image/webp');
			const imageDTO = new ImageDTO(image.id, image.width, image.height, image.mimeType);
			res.status(201).json(imageDTO);
		} catch (err) {
			next(err);
		}
	}

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const thumb = req.query.thumb === 'true';
			const image = await imageRepository.getByID(id);
			if (!image) {
				return res.status(404).json({ error: 'Image not found' });
			}
			const fileName = thumb ? image.thumbnailFilename : image.filename;
			const filePath = path.resolve(__dirname, '../../uploads', fileName);
			if (!fs.existsSync(filePath)) {
				return res.status(404).json({ error: 'File not found' });
			}
			res.sendFile(filePath);
		} catch (err) {
			next(err);
		}
	}
}

export default new ImageController();

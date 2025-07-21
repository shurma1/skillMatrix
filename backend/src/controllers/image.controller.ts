import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/image.service';
import path from 'path';
import ImageRepository from '../repositories/Image.repository';
import fs from 'fs';
import {ImageDTO} from "../dtos/Image.dto";
import imageRepository from "../repositories/Image.repository";
import {isImageMimeType} from "../utils/isImageMimeType";
import {ApiError} from "../error/apiError";


class ImageController {
	async upload(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.file) {
				throw ApiError.errorByType('NO_FILE_UPLOADED');
			}
			
			const originalPath = req.file.path;
			
			if(! isImageMimeType(req.file.mimetype)) {
				fs.unlinkSync(originalPath);
				throw ApiError.errorByType('MIME_TYPE_NOT_SUPPORTED');
			}
			
			const ext = '.webp';
			const webpFilename = path.basename(originalPath, path.extname(originalPath)) + ext;
			const webpPath = path.resolve(path.dirname(originalPath), webpFilename);
			const thumbFilename = path.basename(originalPath, path.extname(originalPath)) + '_thumb' + ext;
			const thumbPath = path.resolve(path.dirname(originalPath), thumbFilename);

			const converted = await ImageService.convertToWEBP(originalPath, webpPath);
			if (!converted) {
				fs.unlinkSync(originalPath);
				throw ApiError.errorByType('FAILED_TO_LOAD_FILE');
			}
			const thumbCreated = await ImageService.createThumbnail(webpPath, thumbPath);
			if (!thumbCreated) {
				fs.unlinkSync(originalPath);
				fs.unlinkSync(webpPath);
				throw ApiError.errorByType('FAILED_TO_LOAD_FILE');
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
				throw ApiError.errorByType('FILE_NOT_FOUND');
			}
			const fileName = thumb ? image.thumbnailFilename : image.filename;
			const filePath = path.resolve(__dirname, '../../uploads', fileName);
			if (!fs.existsSync(filePath)) {
				throw ApiError.errorByType('FILE_NOT_FOUND');
			}
			res.sendFile(filePath);
		} catch (err) {
			next(err);
		}
	}
}

export default new ImageController();

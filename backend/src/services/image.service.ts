import sharp from 'sharp';
import {ApiError} from "../error/apiError";
import {isImageMimeType} from "../utils/isImageMimeType";
import fs from "fs";
import path from "path";
import ImageRepository from "../repositories/image.repository";
import {ImageDTO} from "../dtos/Image.dto";

const THUMBNAIL_SIZE = 100;

class ImageService {
	async convertToWEBP(inputPath: string, outputPath: string, options = { quality: 80 }) {
		try {
			await sharp(inputPath)
				.webp({ quality: options.quality })
				.toFile(outputPath);
			return true;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			return false;
		}
	}
	
	async createThumbnail(inputPath: string, outputPath: string) {
		try {
			await sharp(inputPath)
				.resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
				.toFile(outputPath);
			return true;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			return false;
		}
	}

	async getMetadata(inputPath: string) {
		return await sharp(inputPath).metadata();
	}
	
	async upload(file?: Express.Multer.File) {
		if (!file) {
			throw ApiError.errorByType('NO_FILE_UPLOADED');
		}
		
		const originalPath = file.path;
		
		if(! isImageMimeType(file.mimetype)) {
			fs.unlinkSync(originalPath);
			throw ApiError.errorByType('MIME_TYPE_NOT_SUPPORTED');
		}
		
		const ext = '.webp';
		const webpFilename = path.basename(originalPath, path.extname(originalPath)) + ext;
		const webpPath = path.resolve(path.dirname(originalPath), webpFilename);
		const thumbFilename = path.basename(originalPath, path.extname(originalPath)) + '_thumb' + ext;
		const thumbPath = path.resolve(path.dirname(originalPath), thumbFilename);
		
		const converted = await this.convertToWEBP(originalPath, webpPath);
		if (!converted) {
			fs.unlinkSync(originalPath);
			throw ApiError.errorByType('FAILED_TO_LOAD_FILE');
		}
		const thumbCreated = await this.createThumbnail(webpPath, thumbPath);
		if (!thumbCreated) {
			fs.unlinkSync(originalPath);
			fs.unlinkSync(webpPath);
			throw ApiError.errorByType('FAILED_TO_LOAD_FILE');
		}
		
		fs.unlinkSync(originalPath);
		const metadata = await this.getMetadata(webpPath);
		const width = metadata.width || 0;
		const height = metadata.height || 0;
		
		const image = await ImageRepository.create(width, height, webpFilename, thumbFilename, 'image/webp');
		const imageDTO = new ImageDTO(image.id, image.width, image.height, image.mimeType);
		return imageDTO;
	}
	
	async getInfo(id: string) {
		const imageInfo = await ImageRepository.getByID(id);
		
		if(! imageInfo) {
			throw ApiError.errorByType('IMAGE_NOT_FOUND');
		}
		
		return new ImageDTO(imageInfo.id, imageInfo.width, imageInfo.height, imageInfo.mimeType);
	}
	
	async getImagePath(id: string, isThumb: boolean = false) {
		
		const image = await ImageRepository.getByID(id);
		if (!image) {
			throw ApiError.errorByType('IMAGE_NOT_FOUND');
		}
		const fileName = isThumb ? image.thumbnailFilename : image.filename;
		const filePath = path.resolve(__dirname, '../../uploads', fileName);
		if (!fs.existsSync(filePath)) {
			throw ApiError.errorByType('FILE_NOT_FOUND');
		}
		
		return filePath;
	}
}

export default new ImageService();

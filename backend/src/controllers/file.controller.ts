import { Request, Response, NextFunction } from 'express';
import FileService from "../services/file.service";
import path from "path";
import {getFileExtension} from "../utils/getFileExtension";
import SkillService from "../services/skill.service";

class FileController {
	async upload(req: Request, res: Response, next: NextFunction) {
		try {
			const { name } = req.body;
			
			const fileInfo = await FileService.upload(name, req.file);
			
			res.status(201).send(fileInfo);
		} catch (err) {
			next(err);
		}
	}
	
	async get(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { view } = req.query;
			
			const fileInfo = await FileService.getInfo(id);
			const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileInfo.filename);
			const fileExtension = getFileExtension(fileInfo.filename);
			const fileName = fileExtension ?`${fileInfo.name}.${fileExtension}` : fileInfo.name;
			
			// Если это запрос для просмотра, не используем attachment
			if (view === 'true') {
				res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`);
				
				// Устанавливаем правильный Content-Type для просмотра
				const mimeTypes: { [key: string]: string } = {
					'pdf': 'application/pdf',
					'doc': 'application/msword',
					'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'xls': 'application/vnd.ms-excel',
					'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'ppt': 'application/vnd.ms-powerpoint',
					'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
					'txt': 'text/plain; charset=utf-8',
					'jpg': 'image/jpeg',
					'jpeg': 'image/jpeg',
					'png': 'image/png',
					'gif': 'image/gif',
					'webp': 'image/webp',
					'bmp': 'image/bmp',
					'svg': 'image/svg+xml'
				};
				
				if (fileExtension && mimeTypes[fileExtension.toLowerCase()]) {
					res.setHeader('Content-Type', mimeTypes[fileExtension.toLowerCase()]);
				}
			} else {
				// Для скачивания используем attachment
				res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
			}
			
			res.sendFile(filePath);
		} catch (err) {
			next(err);
		}
	}
	
	async getInfo(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const fileInfo = await FileService.getInfo(id);
			
			res.send(fileInfo);
		} catch (err) {
			next(err);
		}
	}
	
	async confirm(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userId = req.authUser!.id;
			
			await SkillService.confirmFileStudy(id, userId);
			
			res.status(200).send();
		} catch (err) {
			next(err);
		}
	}
	
}

export default new FileController();

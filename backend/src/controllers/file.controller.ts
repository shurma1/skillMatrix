import { Request, Response, NextFunction } from 'express';
import FileService from "../services/file.service";
import path from "path";
import {getFileExtension} from "../utils/getFileExtension";

class SkillController {
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
			
			const fileInfo = await FileService.getInfo(id);
			const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileInfo.filename);
			const fileExtension = getFileExtension(fileInfo.filename);
			const fileName = fileExtension ?`${fileInfo.name}.${fileExtension}` : fileInfo.name;
			
			res.set('Content-Disposition', `attachment; filename="${fileName}"`);
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
	
}

export default new SkillController();

import {ApiError} from "../error/apiError";
import FileRepository from "../repositories/file.repository";
import {FileDTO} from "../dtos/file.dto";

class FileService {
	async upload(name: string, file?: Express.Multer.File) {
		if (!file) {
			throw ApiError.errorByType('NO_FILE_UPLOADED');
		}
		
		const fileInfo = await FileRepository.create(name, file.mimetype, file.size, file.filename);
		
		return new FileDTO(fileInfo.id, fileInfo.name, fileInfo.mimeType, fileInfo.size, fileInfo.filename, fileInfo.createdAt!);
	}
	
	async getInfo(id: string) {
		const fileInfo = await FileRepository.get(id);
		
		if (!fileInfo) {
			throw ApiError.errorByType('FILE_NOT_FOUND');
		}
		
		return new FileDTO(fileInfo.id, fileInfo.name, fileInfo.mimeType, fileInfo.size, fileInfo.filename, fileInfo.createdAt!);
	}
	
	async checkFileExist(id: string) {
		const fileInfo = await FileRepository.get(id);
		
		if (!fileInfo) {
			throw ApiError.errorByType('FILE_NOT_FOUND');
		}
	}
	
	
	// async confirm(fileId: string, userId: string) {
	// 	const fileInfo = await SkillService.get(id);
	//
	// 	if (!fileInfo) {
	// 		throw ApiError.errorByType('FILE_NOT_FOUND');
	// 	}
	// }

}

export default new FileService();

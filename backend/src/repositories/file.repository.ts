import { File } from '../models'
import {FileInstance} from "../models/entities/File";
class FileRepository {
	
	async create(
		name: string,
		mimeType: string,
		size: number,
		filename: string
	): Promise<FileInstance> {
		return await File.create({name, mimeType, size, filename});
	}
	
	async get(id: string): Promise<FileInstance | null> {
		return await File.findOne({where: {id} });
	}
}

export default new FileRepository();

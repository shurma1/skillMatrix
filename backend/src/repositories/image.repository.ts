import Image, {ImageInstance} from '../models/entities/Image';

class ImageRepository {
	async create(
		width: number,
		height: number,
		filename: string,
		thumbnailFilename: string,
		mimeType: string
	): Promise<ImageInstance> {
		return await Image.create({width, height, filename, thumbnailFilename, mimeType});
	}
	
	async getByID(id: string): Promise<ImageInstance | null> {
		return await Image.findOne({ where: { id } });
	}

	async delete(id: string): Promise<boolean> {
		const deletedCount = await Image.destroy({ where: { id } });
		return deletedCount > 0;
	}
}

export default new ImageRepository();

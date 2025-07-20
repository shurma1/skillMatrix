import sharp from 'sharp';

const THUMBNAIL_SIZE = 100;

class ImageService {
	public async convertToWEBP(inputPath: string, outputPath: string, options = { quality: 80 }) {
		try {
			await sharp(inputPath)
				.webp({ quality: options.quality })
				.toFile(outputPath);
			return true;
		} catch (error) {
			return false;
		}
	}
	
	public async createThumbnail(inputPath: string, outputPath: string) {
		try {
			await sharp(inputPath)
				.resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: 'cover' })
				.toFile(outputPath);
			return true;
		} catch (error) {
			return false;
		}
	}

	public async getMetadata(inputPath: string) {
		return await sharp(inputPath).metadata();
	}
}

export default new ImageService();

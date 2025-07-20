export class ImageDTO {
	id: string;
	width: number;
	height: number;
	mimeType: string;
	
	constructor(
		id: string,
		width: number,
		height: number,
		mimeType: string
	) {
		this.id = id;
		this.width = width;
		this.height = height;
		this.mimeType = mimeType;
	}
}

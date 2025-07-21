/**
 * @openapi
 * components:
 *   schemas:
 *     ImageDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the image
 *         width:
 *           type: integer
 *           description: Width of the image in pixels
 *         height:
 *           type: integer
 *           description: Height of the image in pixels
 *         mimeType:
 *           type: string
 *           description: MIME type of the image (e.g., image/webp)
 */
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

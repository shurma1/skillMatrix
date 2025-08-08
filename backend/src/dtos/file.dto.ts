/**
 * @openapi
 * components:
 *   schemas:
 *     FileDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         mimeType:
 *           type: string
 *         size:
 *           type: integer
 *         filename:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export class FileDTO {
	id: string;
	name: string;
	mimeType: string;
	size: number;
	filename: string;
	createdAt: Date;
	
	constructor(
		id: string,
		name: string,
		mimeType: string,
		size: number,
		filename: string,
		createdAt: Date
	) {
		this.id = id;
		this.name = name;
		this.mimeType = mimeType;
		this.size = size;
		this.filename = filename;
		this.createdAt = createdAt;
	}
}

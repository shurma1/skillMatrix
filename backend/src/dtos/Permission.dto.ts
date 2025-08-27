/**
 * @openapi
 * components:
 *   schemas:
 *     PermissionDto:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string }
 *         description: { type: string }
 */
export class PermissionDto {
	id: string;
	name: string;
	description: string;
	
	constructor(
		id: string,
		name: string,
		description: string,
	) {
		this.id = id;
		this.name = name;
		this.description = description;
	}
}

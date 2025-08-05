/**
 * @openapi
 * components:
 *   schemas:
 *     JobRoleDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the job role
 *         title:
 *           type: string
 *           description: Title of the job role
 */
export class JobRoleSearchDTO {
	id: string;
	title: string;

	constructor(id: string, title: string) {
		this.id = id;
		this.title = title;
	}
}

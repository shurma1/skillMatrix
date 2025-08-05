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
export class JobRoleDTO {
	id: string;
	title: string;
	skills: unknown[];
	users: unknown[]

	constructor(id: string, title: string) {
		this.id = id;
		this.title = title;
		this.skills = [];
		this.users = [];
	}
}

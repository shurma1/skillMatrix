/**
 * @openapi
 * components:
 *   schemas:
 *     JobRoleSearchDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 */
export class JobRoleSearchDTO {
	id: string;
	title: string;

	constructor(id: string, title: string) {
		this.id = id;
		this.title = title;
	}
}

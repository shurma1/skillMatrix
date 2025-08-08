/**
 * @openapi
 * components:
 *   schemas:
 *     JobRoleUserSearchDTO:
 *       type: object
 *       properties:
 *         userId: { type: string }
 *         login: { type: string }
 *         email: { type: string, nullable: true }
 *         firstname: { type: string }
 *         lastname: { type: string }
 *         patronymic: { type: string }
 *         avatarId: { type: string, nullable: true }
 *         assignedAt: { type: string, format: date-time }
 */
export class JobRoleUserSearchDTO {
	userId: string;
	login: string;
	email: string | null;
	firstname: string;
	lastname: string;
	patronymic: string;
	avatarId: string | null;
	assignedAt: Date;
	
	constructor(
		userId: string,
		login: string,
		email: string | null,
		firstname: string,
		lastname: string,
		patronymic: string,
		avatarId: string | null,
		assignedAt: Date
	) {
		this.userId = userId;
		this.login = login;
		this.email = email;
		this.firstname = firstname;
		this.lastname = lastname;
		this.avatarId = avatarId;
		this.patronymic = patronymic;
		this.assignedAt = assignedAt;
	}
}

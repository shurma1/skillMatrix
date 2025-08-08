/**
 * @openapi
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         login:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         patronymic:
 *           type: string
 *         avatar_id:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 */
export class UserDTO {
	id: string;
	login: string;
	firstname: string;
	lastname: string;
	patronymic: string;
	avatar_id?: string | null;
	email?: string | null;

	constructor(
		id: string,
		login: string,
		firstname: string,
		lastname: string,
		patronymic: string,
		avatar_id?: string | null,
		email?: string | null,
	) {
		this.id = id;
		this.login = login;
		this.firstname = firstname;
		this.lastname = lastname;
		this.patronymic = patronymic;
		this.avatar_id = avatar_id;
		this.email = email;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AddUserSkillDTO:
 *       type: object
 *       required: [skillId, targetLevel]
 *       properties:
 *         skillId: { type: string }
 *         targetLevel: { type: integer }
 *     UpdateUserSkillTargetLevelDTO:
 *       type: object
 *       required: [targetLevel]
 *       properties:
 *         targetLevel: { type: integer }
 *     AddUserJobroleDTO:
 *       type: object
 *       required: [jobRoleId]
 *       properties:
 *         jobRoleId: { type: string }
 */

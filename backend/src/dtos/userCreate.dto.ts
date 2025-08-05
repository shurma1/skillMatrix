/**
 * @openapi
 * components:
 *   schemas:
 *     UserCreateDTO:
 *       type: object
 *       properties:
 *         login:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         patronymic:
 *           type: string
 *         password:
 *           type: string
 *         avatar_id:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           nullable: true
 */
export class UserCreateDTO {
	login: string;
	firstname: string;
	lastname: string;
	patronymic: string;
	password: string;
	avatar_id?: string;
	email?: string;
	
	constructor(
		login: string,
		firstname: string,
		lastname: string,
		patronymic: string,
		password: string,
		avatar_id?: string,
		email?: string
	) {
		this.login = login;
		this.firstname = firstname;
		this.lastname = lastname;
		this.patronymic = patronymic;
		this.password = password;
		this.avatar_id = avatar_id;
		this.email = email;
	}
}

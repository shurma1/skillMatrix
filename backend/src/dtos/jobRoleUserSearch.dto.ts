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

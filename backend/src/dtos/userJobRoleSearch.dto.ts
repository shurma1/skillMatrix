export class UserJobRoleSearchDTO {
	jobRoleId: string;
	title: string;
	assignedAt: Date;
	
	
	constructor(
		jobRoleId: string,
		title: string,
		assignedAt: Date
	) {
		this.jobRoleId = jobRoleId;
		this.title = title;
		this.assignedAt = assignedAt;
	}
}

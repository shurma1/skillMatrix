/**
 * @openapi
 * components:
 *   schemas:
 *     UserJobRoleSearchDTO:
 *       type: object
 *       properties:
 *         jobRoleId: { type: string }
 *         title: { type: string }
 *         assignedAt: { type: string, format: date-time }
 */
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

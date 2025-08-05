import {FileDTO} from "./file.dto";

export class SkillVersionDTO {
	id: string;
	skillId: string;
	version: number;
	approvedDate: Date;
	auditDate: Date;
	files: FileDTO[];
	testId?: string;
	
	constructor(
		id: string,
		skillId: string,
		version: number,
		approvedDate: Date,
		auditDate: Date,
		files: FileDTO[],
		testId?: string
	) {
		this.id = id;
		this.skillId = skillId;
		this.version = version;
		this.approvedDate = approvedDate;
		this.auditDate = auditDate;
		this.files = files;
		this.testId = testId;
	}
}

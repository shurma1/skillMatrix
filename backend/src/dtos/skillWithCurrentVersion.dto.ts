import {TagDTO} from "./tag.dto";

export enum SkillType {
	Skill = 'skill',
	Document = 'document',
}

export class SkillWithCurrentVersionDTO {
	id: string;
	type: SkillType;
	title: string;
	isActive: boolean;
	approvedDate: Date;
	auditDate: Date;
	authorId: string | null;
	verifierId: string;
	version: number;
	tags: TagDTO[];
	testId?: string;
	
	
	constructor(
		id: string,
		type: SkillType,
		title: string,
		isActive: boolean,
		approvedDate: Date,
		auditDate: Date,
		authorId: string | null,
		verifierId: string,
		version: number,
		tags: TagDTO[],
		testId?: string,
	) {
		this.id = id;
		this.type = type;
		this.title = title;
		this.isActive = isActive;
		this.approvedDate = approvedDate;
		this.auditDate = auditDate;
		this.authorId = authorId;
		this.verifierId = verifierId;
		this.version = version;
		this.tags = tags;
		this.testId = testId;
	}
}

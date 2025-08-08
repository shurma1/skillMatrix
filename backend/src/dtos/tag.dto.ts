// TagSearchDTO
/**
 * @openapi
 * components:
 *   schemas:
 *     TagSearchDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *     TagDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         skillsCount:
 *           type: integer
 *     TagCreateDTO:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *     TagUpdateDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */
export class TagSearchDTO {
	id: string;
	name: string;
	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}
}

// TagDTO
export class TagDTO {
	id: string;
	name: string;
	skillsCount: number;
	constructor(id: string, name: string, skillsCount: number) {
		this.id = id;
		this.name = name;
		this.skillsCount = skillsCount;
	}
}

// TagCreateDTO
export class TagCreateDTO {
	name: string;
	constructor(name: string) {
		this.name = name;
	}
}

// TagUpdateDTO
export class TagUpdateDTO {
	name: string;
	constructor(name: string) {
		this.name = name;
	}
}

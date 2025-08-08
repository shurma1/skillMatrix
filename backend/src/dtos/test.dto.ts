export class PreviewTestDto {
	id: string;
	needScore: number;
	title: string;
	timeLimit: number;
	questionsCount: number;
	
	constructor(
	/**
	 * @openapi
	 * components:
	 *   schemas:
	 *     AnswerVariantDTO:
	 *       type: object
	 *       properties:
	 *         text: { type: string }
	 *         isTrue: { type: boolean }
	 *     QuestionDTO:
	 *       type: object
	 *       properties:
	 *         text: { type: string }
	 *         answerVariants:
	 *           type: array
	 *           items:
	 *             $ref: '#/components/schemas/AnswerVariantDTO'
	 *     CreateTestDTO:
	 *       type: object
	 *       required: [needScore, timeLimit, title, questions]
	 *       properties:
	 *         needScore: { type: integer }
	 *         timeLimit: { type: integer }
	 *         title: { type: string }
	 *         questions:
	 *           type: array
	 *           items:
	 *             $ref: '#/components/schemas/QuestionDTO'
	 *     StartTestDTO:
	 *       type: object
	 *       required: [userId, testId]
	 *       properties:
	 *         userId: { type: string }
	 *         testId: { type: string }
	 *     EndTestDTO:
	 *       type: object
	 *       required: [userId, sessionId]
	 *       properties:
	 *         userId: { type: string }
	 *         sessionId: { type: string }
	 *     SendAnswerDTO:
	 *       type: object
	 *       required: [skillId, testId, questIonId, answerId]
	 *       properties:
	 *         skillId: { type: string }
	 *         testId: { type: string }
	 *         questIonId: { type: string }
	 *         answerId: { type: string }
	 *     AnswerResultDTO:
	 *       type: object
	 *       properties:
	 *         answerId: { type: string }
	 *         answerText: { type: string }
	 *         isTrue: { type: boolean }
	 *         isPicked: { type: boolean }
	 *     QuestionResultDTO:
	 *       type: object
	 *       properties:
	 *         questIonId: { type: string }
	 *         questionText: { type: string }
	 *         answers:
	 *           type: array
	 *           items:
	 *             $ref: '#/components/schemas/AnswerResultDTO'
	 *     UserTestResultDTO:
	 *       type: object
	 *       properties:
	 *         id: { type: string }
	 *         title: { type: string }
	 *         userId: { type: string }
	 *         testId: { type: string }
	 *         score: { type: integer }
	 *         needScore: { type: integer }
	 *         questions:
	 *           type: array
	 *           items:
	 *             $ref: '#/components/schemas/QuestionResultDTO'
	 *     TestDTO:
	 *       type: object
	 *       properties:
	 *         id: { type: string }
	 *         questionsCount: { type: integer }
	 *         needScore: { type: integer }
	 *         timeLimit: { type: integer }
	 *         questions:
	 *           type: array
	 *           items:
	 *             $ref: '#/components/schemas/QuestionDTO'
	 *     PreviewTestDto:
	 *       type: object
	 *       properties:
	 *         id: { type: string }
	 *         needScore: { type: integer }
	 *         title: { type: string }
	 *         timeLimit: { type: integer }
	 *         questionsCount: { type: integer }
	 */
		id: string,
		needScore: number,
		title: string,
		timeLimit: number,
		questionsCount: number,
	) {
		this.id = id;
		this.needScore = needScore;
		this.questionsCount = questionsCount;
		this.title = title;
		this.timeLimit = timeLimit;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AnswerVariantDTO:
 *       type: object
 *       properties:
 *         text: { type: string }
 *         isTrue: { type: boolean }
 *     QuestionDTO:
 *       type: object
 *       properties:
 *         text: { type: string }
 *         answerVariants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnswerVariantDTO'
 *     CreateTestDTO:
 *       type: object
 *       properties:
 *         needScore: { type: integer }
 *         title: { type: string }
 *         timeLimit: { type: integer }
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuestionDTO'
 *     StartTestDTO:
 *       type: object
 *       properties:
 *         userId: { type: string }
 *         testId: { type: string }
 *     SendAnswerDTO:
 *       type: object
 *       properties:
 *         testId: { type: string }
 *         questIonId: { type: string }
 *         answerId: { type: string }
 *     AnswerResultDTO:
 *       type: object
 *       properties:
 *         answerId: { type: string }
 *         answerText: { type: string }
 *         isTrue: { type: boolean }
 *         isPicked: { type: boolean }
 *     QuestionResultDTO:
 *       type: object
 *       properties:
 *         questIonId: { type: string }
 *         questionText: { type: string }
 *         answers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnswerResultDTO'
 *     UserTestResultDTO:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         title: { type: string }
 *         userId: { type: string }
 *         testId: { type: string }
 *         score: { type: integer }
 *         needScore: { type: integer }
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuestionResultDTO'
 *     TestDTO:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         questionsCount: { type: integer }
 *         needScore: { type: integer }
 *         timeLimit: { type: integer }
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuestionDTO'
 *     PreviewTestDto:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         needScore: { type: integer }
 *         title: { type: string }
 *         timeLimit: { type: integer }
 *         questionsCount: { type: integer }
 *     StartTestResponseDTO:
 *       type: object
 *       properties:
 *         sessionId: { type: string }
 *         test:
 *           $ref: '#/components/schemas/TestDTO'
 *         startTime: { type: integer }
 *     UserIdDTO:
 *       type: object
 *       required: [userId]
 *       properties:
 *         userId: { type: string }
 */
export class CreateTestDTO {
	needScore: number;
	title: string;
	timeLimit: number;
	questions: QuestionDTO[];
	constructor(needScore: number, timeLimit: number, title: string, questions: QuestionDTO[]) {
		this.needScore = needScore;
		this.timeLimit = timeLimit;
		this.title = title;
		this.questions = questions;
	}
}

export class QuestionDTO {
	text: string;
	answerVariants: AnswerVariantDTO[];
	constructor(text: string, answerVariants: AnswerVariantDTO[]) {
		this.text = text;
		this.answerVariants = answerVariants;
	}
}

export class AnswerVariantDTO {
	text: string;
	isTrue: boolean;
	constructor(text: string, isTrue: boolean) {
		this.text = text;
		this.isTrue = isTrue;
	}
}

export class StartTestDTO {
	userId: string;
	testId: string;
	constructor(userId: string, testId: string) {
		this.userId = userId;
		this.testId = testId;
	}
}

export class SendAnswerDTO {
	testId: string;
	questIonId: string;
	answerId: string;
	constructor(testId: string, questIonId: string, answerId: string) {
		this.testId = testId;
		this.questIonId = questIonId;
		this.answerId = answerId;
	}
}

export class UserTestResultDTO {
	id: string;
	title: string;
	userId: string;
	testId: string;
	score: number;
	needScore: number;
	questions: QuestionResultDTO[];
	constructor(id: string, title: string, userId: string, testId: string, score: number, needScore: number, questions: QuestionResultDTO[]) {
		this.id = id;
		this.title = title;
		this.userId = userId;
		this.testId = testId;
		this.score = score;
		this.needScore = needScore;
		this.questions = questions;
	}
}

export class QuestionResultDTO {
	questIonId: string;
	questionText: string;
	answers: AnswerResultDTO[];
	constructor(questIonId: string, questionText: string, answers: AnswerResultDTO[]) {
		this.questIonId = questIonId;
		this.questionText = questionText;
		this.answers = answers;
	}
}

export class AnswerResultDTO {
	answerId: string;
	answerText: string;
	isTrue: boolean;
	isPicked: boolean;
	constructor(answerId: string, answerText: string, isTrue: boolean, isPicked: boolean) {
		this.answerId = answerId;
		this.answerText = answerText;
		this.isTrue = isTrue;
		this.isPicked = isPicked;
	}
}

export class TestDTO {
	id: string;
	questionsCount: number;
	needScore: number;
	timeLimit: number;
	questions: QuestionDTO[];
	constructor(id: string, questionsCount: number, needScore: number, timeLimit: number, questions: QuestionDTO[]) {
		this.id = id;
		this.questionsCount = questionsCount;
		this.needScore = needScore;
		this.timeLimit = timeLimit;
		this.questions = questions;
	}
}

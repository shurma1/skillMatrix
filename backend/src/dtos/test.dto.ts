/**
 * @openapi
 * components:
 *   schemas:
 *     PreviewTestDto:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         needScore: { type: integer }
 *         title: { type: string }
 *         timeLimit: { type: integer }
 *         questionsCount: { type: integer }
 */
export class PreviewTestDto {
	id: string;
	needScore: number;
	title: string;
	timeLimit: number;
	questionsCount: number;
	constructor(id: string, needScore: number, title: string, timeLimit: number, questionsCount: number) {
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

/**
 * @openapi
 * components:
 *   schemas:
 *     QuestionDTO:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         text: { type: string }
 *         answerVariants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnswerVariantDTO'
 */
export class QuestionDTO {
	id: string;
	text: string;
	answerVariants: AnswerVariantDTO[];
	constructor(id: string, text: string, answerVariants: AnswerVariantDTO[]) {
		this.id = id;
		this.text = text;
		this.answerVariants = answerVariants;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AnswerVariantDTO:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         text: { type: string }
 *         isTrue: { type: boolean }
 */
export class AnswerVariantDTO {
	id: string;
	text: string;
	isTrue: boolean;
	constructor(id: string, text: string, isTrue: boolean) {
		this.id = id;
		this.text = text;
		this.isTrue = isTrue;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     StartTestDTO:
 *       type: object
 *       required: [userId, testId]
 *       properties:
 *         userId: { type: string }
 *         testId: { type: string }
 */
export class StartTestDTO {
	userId: string;
	testId: string;
	constructor(userId: string, testId: string) {
		this.userId = userId;
		this.testId = testId;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     EndTestDTO:
 *       type: object
 *       required: [userId, sessionId]
 *       properties:
 *         userId: { type: string }
 *         sessionId: { type: string }
 */
export class EndTestDTO {
	userId: string;
	sessionId: string;
	constructor(userId: string, sessionId: string) {
		this.userId = userId;
		this.sessionId = sessionId;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     SendAnswerDTO:
 *       type: object
 *       required: [testId, questionId, answerId]
 *       properties:
 *         testId: { type: string }
 *         questionId: { type: string }
 *         answerId: { type: string }
 */
export class SendAnswerDTO {
	testId: string;
	questionId: string;
	answerId: string;
	constructor(testId: string, questionId: string, answerId: string) {
		this.testId = testId;
		this.questionId = questionId;
		this.answerId = answerId;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
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
 */
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

/**
 * @openapi
 * components:
 *   schemas:
 *     QuestionResultDTO:
 *       type: object
 *       properties:
 *         questIonId: { type: string }
 *         questionText: { type: string }
 *         answers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AnswerResultDTO'
 */
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

/**
 * @openapi
 * components:
 *   schemas:
 *     AnswerResultDTO:
 *       type: object
 *       properties:
 *         answerId: { type: string }
 *         answerText: { type: string }
 *         isTrue: { type: boolean }
 *         isPicked: { type: boolean }
 */
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

/**
 * @openapi
 * components:
 *   schemas:
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
 */
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

/**
 * @openapi
 * components:
 *   schemas:
 *     StartTestResponseDTO:
 *       type: object
 *       properties:
 *         sessionId: { type: string }
 *         test:
 *           $ref: '#/components/schemas/TestDTO'
 *         startTime: { type: integer }
 */
export class StartTestResponseDTO {
	sessionId: string;
	test: TestDTO;
	startTime: number;
	constructor(sessionId: string, test: TestDTO, startTime: number) {
		this.sessionId = sessionId;
		this.test = test;
		this.startTime = startTime;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UserIdDTO:
 *       type: object
 *       required: [userId]
 *       properties:
 *         userId: { type: string }
 */
export class UserIdDTO {
	userId: string;
	constructor(userId: string) {
		this.userId = userId;
	}
}

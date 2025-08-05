export class PreviewTestDto {
	id: string;
	needScore: number;
	title: string;
	timeLimit: number;
	questionsCount: number;
	
	constructor(
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

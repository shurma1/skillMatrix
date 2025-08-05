import TestRepository, {TestSession} from '../repositories/test.repository';
import {
	CreateTestDTO,
	SendAnswerDTO,
	UserTestResultDTO,
	TestDTO,
	QuestionDTO,
	AnswerVariantDTO,
	QuestionResultDTO,
	AnswerResultDTO,
	PreviewTestDto
} from '../dtos/test.dto';
import SkillService from "./skill.service";
import SkillRepository from "../repositories/skill.repository";
import {SkillVersionInstance} from "../models/entities/SkillVersion";
import {ApiError} from "../error/apiError";
import UserService from "./user.service";

class TestService {
	async createTest(skillId: string, dto: CreateTestDTO) {
		
		await SkillService.checkSkillExist(skillId);
		
		const lastVersion = await SkillRepository.getLastVersion(skillId) as SkillVersionInstance;
		
		const isTestAlreadyExists = await this.isTestAlreadyCreateInSkillVersion(lastVersion.id);
		
		if(isTestAlreadyExists) {
			throw ApiError.errorByType('TEST_ALREADY_EXISTS')
		}
		
		if(dto.questions.length < dto.needScore) {
			throw ApiError.errorByType('SCORE_CANNOT_BE_MORE_THAN_QUESTION_LENGTH')
		}
		
		const test = await TestRepository.createTest({ skillVersionId: lastVersion.id, questionsCount: dto.questions.length, ...dto });
		const testFull = await TestRepository.getTestById(test.id);
		
		const questions = Array.isArray(testFull.questions)
			? testFull.questions.map((q) => new QuestionDTO(q.text, Array.isArray(q.answerVariants) ? q.answerVariants.map((a: AnswerVariantDTO) => new AnswerVariantDTO(a.text, a.isTrue)) : []))
			: [];
		return new TestDTO(testFull.id, testFull.questionsCount, testFull.needScore, testFull.timeLimit, questions);
	}

	async startTest(testId: string, userId: string) {
		
		await UserService.checkIsUserExist(userId);
		
		const testFull = await TestRepository.getTestById(testId);
		
		if (!testFull) {
			throw ApiError.errorByType('TEST_NOT_FOUND')
		}
		
		const questions = Array.isArray(testFull.questions)
			? testFull.questions.map((q: QuestionDTO) => new QuestionDTO(q.text, Array.isArray(q.answerVariants) ? q.answerVariants.map((a: AnswerVariantDTO) => new AnswerVariantDTO(a.text, false)) : []))
			: [];
		
		const startTime = Date.now();
		
		const testDTO = new TestDTO(testFull.id, testFull.questionsCount, testFull.needScore, testFull.timeLimit, questions);
		const sessionId = `test:${userId}:${testFull.id}`;
		
		const isSessionAlreadyCreate = !! await TestRepository.getTestSession(sessionId);
		
		if(isSessionAlreadyCreate) {
			return { sessionId, test: testDTO, startTime };
		}
		
		const onTestTimeIsOver = async () => {
			await this.endTest(testId, userId);
		}
		
		const timerId = setTimeout(onTestTimeIsOver, testDTO.timeLimit * 1000);
		
		await TestRepository.saveTestSession(
			sessionId,
			{
				started: Date.now(),
				answers: [],
				timeLimit: testFull.timeLimit,
				questionsCount: testFull.questionsCount,
				startTime,
				timerId,
				userId
			}
		);
		
		return { sessionId, test: testDTO, startTime };
	}
	
	async endTest(sessionId: string, userId: string) {
		
		const parts = sessionId.split(':');
		const [_, sessionUserId, sessionTestId] = parts;
		
		
		await UserService.checkIsUserExist(userId);
		
		if(userId !== sessionUserId) {
			throw ApiError.errorByType('TEST_NOT_FOUND');
		}
		
		const testFull = await TestRepository.getTestById(sessionTestId);
		
		if (!testFull) {
			throw ApiError.errorByType('TEST_NOT_FOUND')
		}
	
		const session = await TestRepository.getTestSession(sessionId) as TestSession;
		
		if(! session) {
			throw ApiError.errorByType('SESSION_NOT_FOUND');
		}
		
		clearTimeout(session.timerId);
		
		let score = 0;
		
		const promises = session.answers.map(async answer => {
			const isValid = await TestRepository.isAnswerValid(answer.questionId, answer.answerId);
			
			if(isValid) {
				score += 1;
			}
		})
		
		await Promise.all(promises);
		
		await TestRepository.saveUserTestResult({
			userId: userId,
			testId: testFull.id,
			targetScore: testFull.needScore,
			score: score,
			answers: session.answers
		});
		await TestRepository.removeTestSession(sessionId);
	}

	async sendAnswer(sessionId: string, userId: string, dto: SendAnswerDTO) {
		
		const parts = sessionId.split(':');
		const [_, sessionUserId, sessionTestId] = parts;
		
		
		await UserService.checkIsUserExist(userId);
		
		if(userId !== sessionUserId) {
			throw ApiError.errorByType('TEST_NOT_FOUND');
		}
		
		const testFull = await TestRepository.getTestById(sessionTestId);
		
		if (!testFull) {
			throw ApiError.errorByType('TEST_NOT_FOUND')
		}
		
		const session = await TestRepository.getTestSession(sessionId) as TestSession;
		
		if(! session) {
			throw ApiError.errorByType('SESSION_NOT_FOUND');
		}
		
		session.answers = session.answers
			.filter(answer => answer.questionId !== dto.questIonId);
		
		session.answers.push({ questionId: dto.questIonId, answerId: dto.answerId });
		
		await TestRepository.saveTestSession(sessionId, session);
	}

	async getUserTestResult(testId: string, userId: string): Promise<UserTestResultDTO> {
		await UserService.checkIsUserExist(userId);
		
		const testFull = await TestRepository.getTestById(testId);
		
		if (!testFull) {
			throw ApiError.errorByType('TEST_NOT_FOUND')
		}
		
		const userTestId = await TestRepository.getUserTestId(userId, testId);
		
		if(!userTestId) {
			throw ApiError.errorByType('TEST_NOT_FOUND')
		}
		
		const userTestResult = await TestRepository.getUserTestResult(userTestId);
		const answers = userTestResult.userTestResults;
		
		const checkIsAnswerPicked = (
			questionId: string,
			answerId: string,
			deleteAfterCheck: boolean = true
		): boolean => {
			const answerIndex = answers.findIndex(
				(answer) => answer.questionId === questionId && answer.answerId === answerId
			);
			
			if (answerIndex !== -1) {
				if (deleteAfterCheck) {
					answers.splice(answerIndex, 1);
				}
				return true;
			}
			
			return false;
		};
		
		const results = testFull.questions.map(q => {
			return new QuestionResultDTO(
				q.id,
				q.text,
				q.answerVariants.map(av => new AnswerResultDTO(av.id, av.text, av.isTrue, checkIsAnswerPicked(q.id, av.id)))
			)
		})
		
		return new UserTestResultDTO(
			userTestId,
			testFull.title,
			userId,
			testId,
			userTestResult.score,
			testFull.needScore,
			results
		);
	}
	
	async getTest(testId: string) {
		const test = await TestRepository.getTest(testId);
		
		if(! test) {
			throw ApiError.errorByType('TEST_NOT_FOUND');
		}
		
		return new PreviewTestDto(test.id, test.needScore, test.title, test.timeLimit, test.questionsCount)
	}
	
	async isTestAlreadyCreateInSkillVersion(skillVersionId: string) {
		return !! await TestRepository.getTestBySkillVersion(skillVersionId);
	}
}

export default new TestService();

import {Test, Question, AnswerVariant, UserTestResult, UserTest, SkillVersion} from '../models';
import { TestInstance } from '../models/entities/Test';
import {QuestionInstance} from "../models/entities/Question";
import {AnswerVariantInstance} from "../models/entities/AnswerVariant";
import {redis} from "../index";
import {UserTestInstance} from "../models/entities/UserTest";
import {UserTestResultInstance} from "../models/entities/UserTestResult";

export interface CreateTestData {
  skillVersionId: string;
  title: string;
  questionsCount: number;
  needScore: number;
  timeLimit: number;
  questions: Array<{
    text: string;
    answerVariants: Array<{ text: string; isTrue: boolean }>;
  }>;
}

export interface SaveUserTestResultData {
	userId: string;
	testId: string;
	targetScore: number;
	score: number;
	answers: Array<{
		questionId: string;
		answerId: string;
	}>;
}

export interface TestSession {
	userId: string;
	started: number,
	answers: UserAnswer[],
	timeLimit: number,
	startTime: number;
	questionsCount: number,
}

interface UserAnswer {
	questionId: string;
	answerId: string;
}

class TestRepository {
	async createTest(data: CreateTestData): Promise<TestInstance> {
		
		const test = await Test.create({
			skillVersionId: data.skillVersionId,
			questionsCount: data.questionsCount,
			needScore: data.needScore,
			timeLimit: data.timeLimit,
			title: data.title
		});
		
		for (const q of data.questions) {
			const question = await Question.create({
				testId: test.id,
				text: q.text
			});
			for (const av of q.answerVariants) {
				await AnswerVariant.create({
					questionId: question.id,
					text: av.text,
					isTrue: av.isTrue
				});
			}
		}
		return test;
	}

	async getTestById(testId: string) {
		return await Test.findByPk(testId, {
			include: [
				{
					model: Question,
					include: [AnswerVariant]
				}
			]
		}) as TestInstance & {questions: (QuestionInstance & {answerVariants: AnswerVariantInstance[]})[]};
	}
	
	async getTestBySkillVersion(skillVersionId: string) {
		return await Test.findOne({where: {skillVersionId}});
	}

	async saveUserTestResult(userTestData: SaveUserTestResultData): Promise<void> {
		const userTest = await UserTest.create({
			testId: userTestData.testId,
			userId: userTestData.userId,
			targetScore: userTestData.targetScore,
			score: userTestData.score,
		})
		
		const promises = userTestData.answers.map(async answer => {
			await UserTestResult.create({
				userTestId: userTest.id,
				answerId: answer.answerId,
				questionId: answer.questionId
			})
		})
		
		await Promise.all(promises);
	}
	
	async isAnswerValid(questionId: string, answerId: string): Promise<boolean> {
		const answer = await AnswerVariant.findOne({where: {id: answerId, questionId}});
		
		if(! answer) {
			return false;
		}
		
		return answer.isTrue;
	}

	async getUserTestResult(userTestId: string) {
		const result = await UserTest.findOne({
			where: {
				id: userTestId
			},
			include: {
				model: UserTestResult
			}
		}) as (UserTestInstance & {userTestResults: UserTestResultInstance[]});
		return result;
	}
	
	async saveTestSession(sessionId: string, session: TestSession) {
		await redis.set(sessionId, JSON.stringify(session));
	}
	
	async getTestSession(sessionId: string): Promise<TestSession | null> {
		const session = await redis.get(sessionId);
		
		if(! session) {
			return null;
		}
		
		return JSON.parse(session) as TestSession;
	}
	
	async removeTestSession(sessionId: string): Promise<void> {
		await redis.del(sessionId);
	}

	async getUserTestId(userId: string, testId: string) {
		const userTest = await UserTest.findOne({where: {
			userId,
			testId
		},
		order: [['createdAt', 'DESC']]
		})
		
		return userTest?.id;
	}
	
	async getTestIdBySkill(skillId: string) {
		const lastSkillVersion = await SkillVersion.findOne({
			where: {
				skillId,
			},
			order: [['createdAt', 'DESC']]
		})
		
		if(!lastSkillVersion) {
			return null;
		}
		
		const test = await Test.findOne({
			where: {
				skillVersionId: lastSkillVersion.id
			},
			order: [['createdAt', 'DESC']]
		})
		
		if(! test) {
			return null;
		}
		
		return test.id;
	}
	
	async getTest(id: string) {
		return await Test.findOne({where: {
			id
		}})
	}
}

export default new TestRepository();

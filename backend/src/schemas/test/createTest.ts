import { typedParam, typedSchema } from '../../utils/typedSchema';

interface AnswerVariantInput {
	text: string;
	isTrue: boolean;
}

interface QuestionInput {
	text: string;
	answerVariants: AnswerVariantInput[];
}

export const createTest = () =>
	typedSchema({
		needScore: typedParam({
			isInt: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		timeLimit: typedParam({
			isInt: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		questions: typedParam({
			isArray: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
			custom: {
				options: (questions: unknown) => {
					if (!Array.isArray(questions)) return false;
					return questions.every((q: QuestionInput) =>
						typeof q.text === 'string' && q.text.length > 0 &&
						Array.isArray(q.answerVariants) && q.answerVariants.length > 0 &&
						q.answerVariants.every((av: AnswerVariantInput) =>
							typeof av.text === 'string' && typeof av.isTrue === 'boolean'
						)
					);
				},
				errorMessage: 'INVALID_DATA',
			},
		}),
	});

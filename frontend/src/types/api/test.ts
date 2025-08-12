export interface AnswerVariantDTO { id: string; text: string; isTrue: boolean; }
export interface QuestionDTO { id: string; text: string; answerVariants: AnswerVariantDTO[]; }
export interface CreateTestDTO { needScore: number; timeLimit: number; title: string; questions: QuestionDTO[]; }
export interface StartTestDTO { userId: string; testId: string; }
export interface EndTestDTO { userId: string; sessionId: string; }
export interface SendAnswerDTO { sessionId: string; questionId: string; answerId: string; }
export interface AnswerResultDTO { answerId: string; answerText: string; isTrue: boolean; isPicked: boolean; }
export interface QuestionResultDTO { questionId: string; questionText: string; answers: AnswerResultDTO[]; }
export interface UserTestResultDTO { id: string; title: string; userId: string; testId: string; score: number; needScore: number; questions: QuestionResultDTO[]; }
export interface TestDTO { id: string; skillId: string; questionsCount: number; needScore: number; timeLimit: number; questions: QuestionDTO[]; }
export interface PreviewTestDto { id: string; needScore: number; title: string; timeLimit: number; questionsCount: number; }
export interface StartTestResponseDTO { sessionId: string; test: TestDTO; startTime: number; }
// Response after sending an answer (Swagger not detailed; inferred minimal fields)
export interface TestAnswerProgressDTO { /* could contain partial scoring info */ }

import { phrases } from "./content.ts";

export type QuizState = {
  readonly sessionId: string;
  readonly questionIndex: number;
  readonly questionIds: readonly string[];
  readonly answers: Readonly<Record<string, string>>;
  readonly selectedAnswerId: string | null;
  readonly optionIdsByQuestion: readonly (readonly string[])[];
  readonly isComplete: boolean;
};
type QuestionContext = { sessionId: string; questionId: string };
export type QuizAction =
  | ({ type: "ANSWER"; answerId: string } & QuestionContext)
  | ({ type: "NEXT" | "PREVIOUS" | "MISSING" | "COMPLETE" } & QuestionContext)
  | { type: "RESET"; session: QuizState };

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError("Random source must return a number in [0, 1).");
    const j = Math.floor(sample * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
/** Create once at a session boundary; serialize the same session for SSR and hydration. */
export function createQuizSession(sessionId: string, random: () => number = Math.random): QuizState {
  const questions = shuffle(phrases, random);
  return {
    sessionId, questionIndex: 0, questionIds: questions.map(p => p.id), answers: {},
    selectedAnswerId: null, isComplete: false,
    optionIdsByQuestion: questions.map(p => shuffle([p.id, ...p.distractorIds], random)),
  };
}
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (action.type === "RESET") return action.session.sessionId === state.sessionId ? state : action.session;
  const id = state.questionIds[state.questionIndex];
  if (state.isComplete || action.sessionId !== state.sessionId || action.questionId !== id) return state;
  const move = (index: number): QuizState => index < 0 || index >= state.questionIds.length || index === state.questionIndex ? state :
    { ...state, questionIndex: index, selectedAnswerId: state.answers[state.questionIds[index]] ?? null };
  switch (action.type) {
    case "ANSWER":
      if (state.answers[id] || !state.optionIdsByQuestion[state.questionIndex].includes(action.answerId)) return state;
      return { ...state, answers: { ...state.answers, [id]: action.answerId }, selectedAnswerId: action.answerId };
    case "NEXT": return move(state.questionIndex + 1);
    case "PREVIOUS": return move(state.questionIndex - 1);
    case "MISSING": return move(state.questionIds.findIndex(questionId => !state.answers[questionId]));
    case "COMPLETE": return Object.keys(state.answers).length === state.questionIds.length ? { ...state, isComplete: true } : state;
  }
}
export function getQuizProgress(state: QuizState) {
  const answered = Object.keys(state.answers).length;
  return { answered, total: state.questionIds.length, percent: answered * 100 / state.questionIds.length };
}
export function isAnswerCorrect(state: QuizState): boolean | null {
  return state.selectedAnswerId === null ? null : state.selectedAnswerId === state.questionIds[state.questionIndex];
}

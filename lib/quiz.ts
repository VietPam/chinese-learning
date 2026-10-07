import { phrases } from "./content.ts";

export type QuizState = {
  readonly sessionId: string;
  readonly questionIndex: number;
  readonly selectedAnswerId: string | null;
  readonly optionIdsByQuestion: readonly (readonly string[])[];
  readonly isComplete: boolean;
};

type QuestionContext = { sessionId: string; questionId: string };
export type QuizAction =
  | ({ type: "ANSWER"; answerId: string } & QuestionContext)
  | ({ type: "NEXT" | "COMPLETE" } & QuestionContext)
  | { type: "RESET"; session: QuizState };

/** Call at a session boundary, never inside a reducer or on every render.
 * For SSR, pass the same serialized session to the client, or initialize after
 * mount with a neutral loading state on both server and first client render.
 */
export function createQuizSession(
  sessionId: string,
  random: () => number = Math.random,
): QuizState {
  const optionIdsByQuestion = phrases.map((phrase) => {
    const ids = [phrase.id, ...phrase.distractorIds];
    for (let i = ids.length - 1; i > 0; i--) {
      const sample = random();
      if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
        throw new RangeError("Random source must return a number in [0, 1).");
      }
      const j = Math.floor(sample * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  });
  return { sessionId, questionIndex: 0, selectedAnswerId: null, optionIdsByQuestion, isComplete: false };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  if (action.type === "RESET") {
    // A new session ID also rejects delayed events from the preceding session.
    return action.session.sessionId === state.sessionId ? state : action.session;
  }
  const question = phrases[state.questionIndex];
  if (
    state.isComplete || !question ||
    action.sessionId !== state.sessionId || action.questionId !== question.id
  ) return state;

  switch (action.type) {
    case "ANSWER":
      if (state.selectedAnswerId !== null ||
          !state.optionIdsByQuestion[state.questionIndex].includes(action.answerId)) return state;
      return { ...state, selectedAnswerId: action.answerId };
    case "NEXT":
      if (state.selectedAnswerId === null || state.questionIndex === phrases.length - 1) return state;
      return { ...state, questionIndex: state.questionIndex + 1, selectedAnswerId: null };
    case "COMPLETE":
      if (state.selectedAnswerId === null || state.questionIndex !== phrases.length - 1) return state;
      return { ...state, isComplete: true };
  }
}

export function getQuizProgress(state: QuizState) {
  const answered = state.questionIndex + (state.selectedAnswerId === null ? 0 : 1);
  return { answered, total: phrases.length, percent: (answered * 100) / phrases.length };
}

/** null means unanswered; choice position is deliberately irrelevant. */
export function isAnswerCorrect(state: QuizState): boolean | null {
  return state.selectedAnswerId === null ? null : state.selectedAnswerId === phrases[state.questionIndex].id;
}

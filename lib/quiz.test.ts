import { test } from "node:test";
import assert from "node:assert/strict";
import { phrases } from "./content.ts";
import { createQuizSession, getQuizProgress, isAnswerCorrect, quizReducer, type QuizState, type QuizAction } from "./quiz.ts";
const phrase = (s: QuizState) => phrases.find(p => p.id === s.questionIds[s.questionIndex])!;
const context = (s: QuizState) => ({ sessionId: s.sessionId, questionId: phrase(s).id });
const action = (s: QuizState, type: "NEXT" | "PREVIOUS" | "COMPLETE" | "MISSING") => quizReducer(s, { type, ...context(s) });
const answer = (s: QuizState, answerId = phrase(s).id) => quizReducer(s, { type: "ANSWER", ...context(s), answerId });

test("shuffles a complete unique set of questions and choices without mutating content", () => {
  const before = JSON.stringify(phrases);
  const a = createQuizSession("a", () => 0), b = createQuizSession("b", () => .99);
  assert.notDeepEqual(a.questionIds, b.questionIds);
  for (const state of [a, b]) {
    assert.deepEqual([...state.questionIds].sort(), phrases.map(p => p.id).sort());
    state.questionIds.forEach((id, i) => {
      const p = phrases.find(p => p.id === id)!;
      assert.deepEqual([...state.optionIdsByQuestion[i]].sort(), [id, ...p.distractorIds].sort());
    });
    assert.equal(getQuizProgress(state).answered, 0);
  }
  assert.equal(JSON.stringify(phrases), before);
  for (const value of [-1, 1, NaN, Infinity]) assert.throws(() => createQuizSession("invalid", () => value), RangeError);
});
test("skip, return, and answer without losing choices or counting a question twice", () => {
  let s = createQuizSession("a");
  const original = s;
  assert.equal(action(s, "PREVIOUS"), s);
  s = action(s, "NEXT");
  assert.equal(s.questionIndex, 1);
  assert.equal(getQuizProgress(s).answered, 0);
  s = answer(s, phrase(s).distractorIds[0]);
  assert.equal(isAnswerCorrect(s), false);
  const selected = s.selectedAnswerId;
  s = action(action(s, "PREVIOUS"), "NEXT");
  assert.equal(s.selectedAnswerId, selected);
  assert.equal(answer(s), s);
  assert.equal(getQuizProgress(s).answered, 1);
  assert.equal(s.optionIdsByQuestion, original.optionIdsByQuestion);
  s = action(s, "MISSING");
  assert.equal(s.questionIndex, 0);
  assert.equal(s.selectedAnswerId, null);
  assert.equal(action(s, "COMPLETE"), s);
});
test("rejects stale events, duplicate next, invalid answers and old session actions", () => {
  const s = createQuizSession("a");
  assert.equal(answer(s, "invalid"), s);
  const next: QuizAction = { type: "NEXT", ...context(s) };
  const moved = quizReducer(s, next);
  assert.equal(quizReducer(moved, next), moved);
  assert.equal(quizReducer(moved, { type: "ANSWER", ...context(s), answerId: phrase(s).id }), moved);
  const reset = quizReducer(s, { type: "RESET", session: createQuizSession("b") });
  assert.equal(quizReducer(reset, next), reset);
});
test("complete only after all answers, including skipped questions, and reset fresh", () => {
  let s = createQuizSession("a");
  for (let i = 0; i < phrases.length; i++) {
    if (i !== 3) s = answer(s);
    s = action(s, "NEXT");
  }
  assert.equal(getQuizProgress(s).answered, phrases.length - 1);
  assert.equal(action(s, "COMPLETE"), s);
  s = action(s, "MISSING");
  assert.equal(s.questionIndex, 3);
  s = answer(s);
  assert.equal(isAnswerCorrect(s), true);
  assert.equal(getQuizProgress(s).percent, 100);
  s = action(s, "COMPLETE");
  assert.equal(s.isComplete, true);
  assert.equal(action(s, "PREVIOUS"), s);
  const fresh = createQuizSession("b");
  assert.equal(quizReducer(s, { type: "RESET", session: fresh }), fresh);
  assert.equal(getQuizProgress(fresh).answered, 0);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { phrases } from "./content.ts";
import { createQuizSession, getQuizProgress, isAnswerCorrect, quizReducer } from "./quiz.ts";
import type { QuizState } from "./quiz.ts";

const context = (s: QuizState) => ({ sessionId: s.sessionId, questionId: phrases[s.questionIndex].id });
const answer = (s: QuizState, answerId = phrases[s.questionIndex].id) => quizReducer(s, { type: "ANSWER", ...context(s), answerId });
const next = (s: QuizState) => quizReducer(s, { type: "NEXT", ...context(s) });
const complete = (s: QuizState) => quizReducer(s, { type: "COMPLETE", ...context(s) });

test("shuffle preserves exactly three choices, allows all permutations, and does not mutate content", () => {
  const before = JSON.stringify(phrases);
  const permutations = new Set<string>();
  for (const first of [0, 0.4, 0.8]) for (const second of [0, 0.8]) {
    let calls = 0;
    const s = createQuizSession("test", () => calls++ % 2 === 0 ? first : second);
    permutations.add(s.optionIdsByQuestion[0].join(","));
    for (const [i, ids] of s.optionIdsByQuestion.entries()) {
      assert.deepEqual([...ids].sort(), [phrases[i].id, ...phrases[i].distractorIds].sort());
    }
    assert.deepEqual(getQuizProgress(s), { answered: 0, total: 20, percent: 0 });
    assert.equal(isAnswerCorrect(s), null);
  }
  assert.equal(permutations.size, 6);
  assert.equal(JSON.stringify(phrases), before);
  for (const value of [-1, 1, NaN, Infinity]) assert.throws(() => createQuizSession("invalid", () => value), RangeError);
});

test("grading uses IDs in every choice position and keeps options stable", () => {
  const positions = new Set<number>();
  for (const samples of [[0, 0], [0.99, 0], [0.99, 0.99]]) {
    let calls = 0;
    const initial = createQuizSession("test", () => samples[calls++ % 2]);
    positions.add(initial.optionIdsByQuestion[0].indexOf("p01"));
    const original = JSON.stringify(initial);
    const correct = answer(initial);
    const wrong = answer(initial, phrases[0].distractorIds[0]);
    assert.equal(isAnswerCorrect(correct), true);
    assert.equal(isAnswerCorrect(wrong), false);
    assert.equal(correct.optionIdsByQuestion, initial.optionIdsByQuestion);
    assert.equal(JSON.stringify(initial), original);
    assert.equal(getQuizProgress(correct).answered, 1);
    assert.equal(getQuizProgress(wrong).answered, 1);
    assert.equal(answer(correct, phrases[0].distractorIds[0]), correct);
    assert.equal(answer(wrong), wrong);
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2]);
});

test("rejects unavailable answers, premature actions, duplicate Next and stale question events", () => {
  const initial = createQuizSession("test", () => 0);
  assert.equal(answer(initial, "not-an-option"), initial);
  assert.equal(next(initial), initial);
  assert.equal(complete(initial), initial);
  const answered = answer(initial);
  assert.equal(complete(answered), answered);
  const action = { type: "NEXT" as const, ...context(answered) };
  const moved = quizReducer(answered, action);
  assert.equal(moved.questionIndex, 1);
  assert.equal(moved.selectedAnswerId, null);
  assert.equal(getQuizProgress(moved).answered, 1);
  assert.equal(quizReducer(moved, action), moved);
  // p01 is also a valid distractor for p02: question context must reject it.
  assert.equal(quizReducer(moved, { type: "ANSWER", ...context(initial), answerId: "p01" }), moved);
});

test("full mixed-result session keeps last feedback until explicit completion, then resets", () => {
  let state = createQuizSession("first", () => 0);
  for (let i = 0; i < 20; i++) {
    assert.equal(state.questionIndex, i);
    assert.equal(getQuizProgress(state).answered, i);
    assert.equal(complete(state), state);
    state = answer(state, i % 2 ? phrases[i].distractorIds[0] : phrases[i].id);
    assert.equal(isAnswerCorrect(state), i % 2 === 0);
    assert.equal(getQuizProgress(state).answered, i + 1);
    assert.equal(getQuizProgress(state).percent, (i + 1) * 5);
    if (i < 19) state = next(state);
  }
  assert.equal(state.isComplete, false);
  assert.equal(next(state), state);
  const done = complete(state);
  assert.equal(done.isComplete, true);
  assert.equal(done.selectedAnswerId, state.selectedAnswerId);
  assert.equal(getQuizProgress(done).percent, 100);
  assert.equal(answer(done), done);
  assert.equal(next(done), done);
  assert.equal(complete(done), done);
  const fresh = createQuizSession("second", () => 0.99);
  const reset = quizReducer(done, { type: "RESET", session: fresh });
  assert.equal(reset, fresh);
  assert.equal(reset.questionIndex, 0);
  assert.equal(reset.selectedAnswerId, null);
  assert.equal(reset.isComplete, false);
  assert.equal(getQuizProgress(reset).answered, 0);
  assert.notDeepEqual(reset.optionIdsByQuestion, done.optionIdsByQuestion);
  assert.equal(quizReducer(reset, { type: "RESET", session: fresh }), reset);
  assert.equal(quizReducer(reset, { type: "ANSWER", sessionId: "first", questionId: "p01", answerId: "p01" }), reset);
});

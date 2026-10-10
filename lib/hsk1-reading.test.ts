import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  LETTERS, answerLabel, availableAnswers, explanationRows, hsk1AudioItems, hsk1Questions, hsk1Reducer, hsk1Sections, initialHsk1State,
  lineAudioId, plainText, scoreHsk1, spokenText, tokenize, type Hsk1Answer, type Hsk1Item, type Hsk1State,
} from "./hsk1-reading.ts";
import { hsk1Vocabulary } from "./hsk1-vocabulary.ts";

const items = (section: (typeof hsk1Sections)[number]): Hsk1Item[] => [section.example, ...section.questions];
const blanks = (item: Hsk1Item) => item.lines.flatMap(line => tokenize(line.text)).filter(token => token.kind === "blank").length;

test("reading test follows the HSK 1 layout: four parts of five questions numbered 1–20", () => {
  assert.deepEqual(hsk1Sections.map(s => s.part), [1, 2, 3, 4]);
  assert.ok(hsk1Sections.every(s => s.questions.length === 5 && s.instruction && s.summary));
  assert.deepEqual(hsk1Questions.map(q => q.number), Array.from({ length: 20 }, (_, i) => i + 1));
  assert.deepEqual(hsk1Questions.map(q => q.id), Array.from({ length: 20 }, (_, i) => `q${String(i + 1).padStart(2, "0")}`));
});

test("every Chinese line uses HSK 1 words only and has a Vietnamese translation and explanation", () => {
  for (const section of hsk1Sections) {
    const lines = [...items(section).flatMap(item => item.lines), ...section.choices.flatMap(c => c.line ? [c.line] : [])];
    for (const line of lines) {
      assert.doesNotThrow(() => tokenize(line.text), line.text);
      assert.ok(line.vi.trim(), line.text);
      assert.ok(!line.text.includes("  ") && line.text === line.text.trim());
    }
    for (const item of items(section)) {
      assert.ok(item.explanation.trim());
      assert.equal(blanks(item), section.part === 4 ? 1 : 0);
      assert.ok(availableAnswers({ part: section.part }).includes(item.answer) || item === section.example);
    }
  }
  for (const word of Object.values(hsk1Vocabulary)) assert.ok(word.pinyin.trim() && word.meaning.trim());
});

test("part 1 pairs a described picture with one word and mixes matches and mismatches", () => {
  const [part1] = hsk1Sections;
  assert.equal(part1.choices.length, 0);
  for (const item of items(part1)) {
    assert.ok(item.picture?.emoji && item.picture.label);
    assert.equal(item.lines.length, 1);
    const tokens = tokenize(item.lines[0].text);
    assert.equal(tokens.length, 1);
    assert.ok(item.answer === "match" || item.answer === "mismatch");
    if (item.answer === "mismatch") {
      assert.ok(item.pictureWord && hsk1Vocabulary[item.pictureWord]);
      assert.notEqual(item.pictureWord, item.lines[0].text);
    } else assert.equal(item.pictureWord, undefined);
  }
  const answers = part1.questions.map(q => q.answer);
  assert.ok(answers.includes("match") && answers.includes("mismatch"));
});

test("parts 2–4 share six choices: the example takes one and each question takes another exactly once", () => {
  for (const section of hsk1Sections.slice(1)) {
    assert.equal(section.choices.length, 6);
    for (const choice of section.choices) {
      if (section.part === 2) assert.ok(choice.picture && !choice.line);
      else assert.ok(choice.line && !choice.picture);
      if (section.part === 4) assert.equal(tokenize(choice.line!.text).length, 1);
    }
    assert.ok(items(section).every(item => !item.picture && item.lines.length > 0));
    assert.deepEqual(items(section).map(item => item.answer).sort(), [...LETTERS]);
    assert.ok(!section.questions.some(q => q.answer === section.example.answer));
  }
});

test("content document matches the implemented questions and answer key", () => {
  const doc = readFileSync(new URL("../docs/hsk1-reading-content.md", import.meta.url), "utf8");
  for (const q of hsk1Questions) {
    const prompt = q.picture ? `${q.picture.emoji} ${q.picture.label} · ${plainText(q.lines[0])}` : q.lines.map(plainText).join(" ");
    assert.ok(doc.includes(`| ${q.number} | ${prompt} | ${answerLabel(q.answer)} | ${q.explanation} |`), `câu ${q.number}`);
  }
});

const correct = (id: string) => hsk1Questions.find(q => q.id === id)!.answer;
function answerAll(choose: (index: number) => Hsk1Answer | undefined) {
  let state = hsk1Reducer(initialHsk1State, { type: "START" });
  hsk1Questions.forEach((q, index) => {
    state = hsk1Reducer(state, { type: "GO", index });
    const answer = choose(index);
    if (answer) state = hsk1Reducer(state, { type: "ANSWER", questionId: q.id, answer });
  });
  return state;
}
const wrongAnswer = (index: number): Hsk1Answer => availableAnswers(hsk1Questions[index]).find(a => a !== hsk1Questions[index].answer)!;

test("reducer starts, locks the first valid answer and ignores stale or unavailable answers", () => {
  assert.equal(hsk1Reducer(initialHsk1State, { type: "ANSWER", questionId: "q01", answer: "match" }), initialHsk1State);
  let state = hsk1Reducer(initialHsk1State, { type: "START" });
  assert.deepEqual(state, { stage: "question", index: 0, answers: {} });
  state = hsk1Reducer(state, { type: "ANSWER", questionId: "q01", answer: "mismatch" });
  assert.equal(state.answers.q01, "mismatch");
  assert.equal(hsk1Reducer(state, { type: "ANSWER", questionId: "q01", answer: "match" }), state);
  assert.equal(hsk1Reducer(state, { type: "ANSWER", questionId: "q02", answer: "match" }), state);
  state = hsk1Reducer(state, { type: "GO", index: 5 });
  assert.equal(hsk1Reducer(state, { type: "ANSWER", questionId: "q06", answer: "match" }), state);
  assert.equal(hsk1Reducer(state, { type: "ANSWER", questionId: "q06", answer: hsk1Sections[1].example.answer }), state);
  assert.equal(hsk1Reducer(state, { type: "GO", index: 20 }), state);
  assert.equal(hsk1Reducer(state, { type: "GO", index: -1 }), state);
  assert.equal(hsk1Reducer(state, { type: "GO", index: 5 }), state);
});

test("finish requires every answer; missing jumps to the first unanswered; restart clears answers", () => {
  let state: Hsk1State = answerAll(index => index === 3 || index === 9 ? undefined : correct(hsk1Questions[index].id));
  assert.equal(hsk1Reducer(state, { type: "FINISH" }), state);
  state = hsk1Reducer(state, { type: "MISSING" });
  assert.equal(state.index, 3);
  state = hsk1Reducer(state, { type: "ANSWER", questionId: "q04", answer: correct("q04") });
  state = hsk1Reducer(state, { type: "MISSING" });
  assert.equal(state.index, 9);
  state = hsk1Reducer(state, { type: "ANSWER", questionId: "q10", answer: correct("q10") });
  state = hsk1Reducer(state, { type: "FINISH" });
  assert.equal(state.stage, "result");
  const review = hsk1Reducer(state, { type: "GO", index: 7 });
  assert.deepEqual([review.stage, review.index, review.answers], ["question", 7, state.answers]);
  assert.deepEqual(hsk1Reducer(state, { type: "RESTART" }), { stage: "question", index: 0, answers: {} });
});

test("score is out of 100 with a 60-point reference pass mark and per-part totals", () => {
  const perfect = scoreHsk1(answerAll(index => hsk1Questions[index].answer).answers);
  assert.deepEqual([perfect.score, perfect.correct, perfect.passed, perfect.wrong.length], [100, 20, true, 0]);
  const twelve = scoreHsk1(answerAll(index => index < 12 ? hsk1Questions[index].answer : wrongAnswer(index)).answers);
  assert.deepEqual([twelve.score, twelve.passed], [60, true]);
  assert.deepEqual(twelve.byPart.map(p => p.correct), [5, 5, 2, 0]);
  assert.deepEqual(twelve.wrong.map(q => q.number), [13, 14, 15, 16, 17, 18, 19, 20]);
  const eleven = scoreHsk1(answerAll(index => index < 11 ? hsk1Questions[index].answer : wrongAnswer(index)).answers);
  assert.deepEqual([eleven.score, eleven.passed], [55, false]);
  assert.equal(scoreHsk1({}).score, 0);
});

test("audio items cover every explanation line with the blank filled and every word that can be looked up", () => {
  const { sentences, words } = hsk1AudioItems();
  assert.equal(new Set(sentences.map(s => s.id)).size, sentences.length);
  assert.equal(new Set(words.map(w => `${w.hanzi}:${w.pinyin}`)).size, words.length);
  const byId = new Map(sentences.map(s => [s.id, s.text]));
  for (const question of hsk1Questions) {
    for (const row of explanationRows(question)) {
      const text = spokenText(row.line, row.fill);
      assert.equal(byId.get(lineAudioId(row)), text);
      assert.ok(text && !/[\s_]/.test(text), text);
      for (const token of [...tokenize(row.line.text), ...row.fill ? tokenize(row.fill) : []]) {
        if (token.kind === "word") assert.ok(words.some(w => w.hanzi === token.text && w.pinyin === token.pinyin), token.text);
      }
    }
  }
  assert.equal(spokenText(hsk1Questions[15].lines[0], "漂亮"), "你的衣服很漂亮。");
  assert.deepEqual(explanationRows(hsk1Questions[18]).map(row => spokenText(row.line, row.fill)), ["你女儿多大了？", "她七岁了。"]);
  assert.deepEqual(explanationRows(hsk1Questions[1]).map(row => row.label), ["Từ", "Tranh"]);
  assert.deepEqual(explanationRows(hsk1Questions[10]).map(row => row.label), ["Câu hỏi", "Đáp án D"]);
});

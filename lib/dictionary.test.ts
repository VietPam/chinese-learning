import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { countByLevel, foldPinyin, foldVietnamese, searchDictionary, type DictionaryEntry } from "./dictionary-search.ts";
import { hsk1Vocabulary } from "./hsk1-vocabulary.ts";

const entries: DictionaryEntry[] = JSON.parse(readFileSync(new URL("./dictionary.json", import.meta.url), "utf8"));
const first = (query: string, level: 0 | 1 | 2 | 3 = 0) => searchDictionary(entries, query, level)[0]?.hanzi;

test("dictionary holds HSK 2.0 levels 1–3 plus the web's HSK 1 test words, each complete", () => {
  assert.equal(entries.length, 601);
  assert.equal(new Set(entries.map(e => e.hanzi)).size, entries.length);
  assert.deepEqual(countByLevel(entries), { 0: 601, 1: 156, 2: 147, 3: 298 });
  for (const entry of entries) {
    assert.match(entry.hanzi, /^\p{Script=Han}+$/u);
    assert.match(entry.pinyin, /^[\p{L}' ]+$/u, entry.hanzi);
    assert.equal(entry.hanViet.split(" ").length, [...entry.hanzi].length, entry.hanzi);
    assert.ok(entry.meaning.trim() && !entry.meaning.includes("|"), entry.hanzi);
    assert.ok(Number.isInteger(entry.rank) && entry.rank > 0);
  }
  for (const [hanzi, word] of Object.entries(hsk1Vocabulary)) {
    const entry = entries.find(e => e.hanzi === hanzi);
    assert.ok(entry, hanzi);
    assert.equal(entry.pinyin, word.pinyin, hanzi);
  }
});

test("folding ignores tones, diacritics, spaces, tone numbers and v for ü", () => {
  assert.equal(foldPinyin("Xuéshēng"), "xuesheng");
  assert.equal(foldPinyin("xue2 sheng1"), "xuesheng");
  assert.equal(foldPinyin("nǚ'ér"), "nver");
  assert.equal(foldPinyin("nǚ'ér", "u"), "nuer");
  assert.equal(foldVietnamese("  Học   Sinh "), "hoc sinh");
  assert.equal(foldVietnamese("Đường"), "duong");
});

test("search ranks hanzi, pinyin, Hán Việt and Vietnamese matches", () => {
  assert.equal(first("学生"), "学生");
  assert.ok(searchDictionary(entries, "学").slice(0, 3).every(e => e.hanzi.startsWith("学")));
  for (const query of ["xuesheng", "xue sheng", "xuéshēng", "xue2sheng5", "hoc sinh", "học sinh"]) assert.equal(first(query), "学生", query);
  assert.equal(first("ăn"), "吃");
  assert.equal(first("an"), "吃");
  assert.equal(first("lv"), "绿");
  assert.equal(first("lü"), "绿");
  assert.ok(searchDictionary(entries, "lu").some(e => e.hanzi === "绿"));
  assert.equal(first("cảm ơn"), "谢谢");
  assert.equal(first("Bắc Kinh"), "北京");
  assert.deepEqual(searchDictionary(entries, "zzzz"), []);
  // Pinyin marks never match Vietnamese text, and Vietnamese marks never match pinyin.
  assert.ok(searchDictionary(entries, "mā").every(e => foldPinyin(e.pinyin).startsWith("ma")));
  assert.ok(searchDictionary(entries, "mẹ").some(e => e.hanzi === "妈妈"));
});

test("level filter applies before search and without a query keeps the data order", () => {
  assert.equal(searchDictionary(entries, "", 2).length, 147);
  assert.ok(searchDictionary(entries, "", 3).every(e => e.level === 3));
  assert.deepEqual(searchDictionary(entries, "").map(e => e.hanzi), entries.map(e => e.hanzi));
  assert.equal(first("xuesheng", 2), undefined);
  assert.equal(first("hoc", 1), searchDictionary(entries, "hoc").find(e => e.level === 1)?.hanzi);
});

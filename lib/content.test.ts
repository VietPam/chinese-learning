import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { phrases } from "./content.ts";

test("20 distinct phrases have complete explanations and unambiguous option strings", () => {
  assert.equal(phrases.length, 20);
  assert.equal(new Set(phrases.map(p => p.id)).size, 20);
  for (const [index, phrase] of phrases.entries()) {
    assert.equal(phrase.id, `p${String(index + 1).padStart(2, "0")}`);
    assert.equal(phrase.category, index < 10 ? "ask" : "update");
    for (const value of [phrase.vietnamese, phrase.pinyin, phrase.keyboardInput, phrase.hanzi]) assert.ok(value.trim());
    assert.match(phrase.keyboardInput, /^[a-z]+(?: [a-z]+)*$/);
    // Current corpus contains no ü: this check must be revised if it is introduced.
    assert.equal(phrase.keyboardInput, phrase.pinyin.normalize("NFD").replace(/\p{M}/gu, ""));
    assert.ok(phrase.words.length > 0);
    assert.equal(phrase.words.map(w => w.pinyin).join(" "), phrase.pinyin);
    assert.equal(phrase.words.map(w => w.hanzi).join(""), phrase.hanzi.replace(/[。？]/gu, ""));
    assert.ok(phrase.words.every(w => w.meaning.trim().length > 0));
    const ids = [phrase.id, ...phrase.distractorIds];
    assert.equal(ids.length, 3);
    assert.equal(new Set(ids).size, 3);
    const choices = ids.map(id => phrases.find(p => p.id === id));
    assert.ok(choices.every(Boolean));
    assert.equal(new Set(choices.map(p => p?.pinyin)).size, 3);
    assert.ok(choices.every(p => p?.category === phrase.category));
  }
});

test("implementation matches the reviewed Markdown table and explanation references", () => {
  const doc = readFileSync(new URL("../docs/content.md", import.meta.url), "utf8");
  for (const p of phrases) {
    assert.ok(doc.includes(`| ${p.id} | ${p.vietnamese} | ${p.pinyin} | \`${p.keyboardInput}\` | ${p.hanzi} |`));
    const section = doc.split(`### ${p.id} — `)[1].split(/\n##/)[0];
    for (const word of p.words) assert.ok(section.includes(`- ${word.pinyin} / ${word.hanzi}: ${word.meaning}`));
    for (const id of p.distractorIds) assert.ok(section.includes(`\`${id}\``));
  }
});

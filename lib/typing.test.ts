import { test } from "node:test";
import assert from "node:assert/strict";
import { checkHanzi } from "./typing.ts";
import { phrases } from "./content.ts";

test("accepts all sample sentences with optional whitespace and punctuation", () => {
  for (const p of phrases) {
    assert.equal(checkHanzi(p.hanzi, p.hanzi), true);
    assert.equal(checkHanzi(` \n${p.hanzi.replace(/[\p{P}]/gu, '').split('').join(' ')}！ `, p.hanzi), true);
  }
});
test("rejects empty, pinyin, wrong or missing characters, symbols and traditional substitutions", () => {
  for (const value of ["", " 。！？ ", "wo zai chifan", "我在吃", "我在吃反", "我在吃饭🍚", "我在吃飯"]) {
    assert.equal(checkHanzi(value, "我在吃饭。"), false);
  }
});

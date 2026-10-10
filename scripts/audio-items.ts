// Prints the HSK 1 and dictionary recordings needed by scripts/generate-audio.py as JSON.
import { readFileSync } from "node:fs";
import { hsk1AudioItems } from "../lib/hsk1-reading.ts";

const { sentences, words } = hsk1AudioItems();
const dictionary: { hanzi: string; pinyin: string }[] = JSON.parse(readFileSync(new URL("../lib/dictionary.json", import.meta.url), "utf8"));
const seen = new Set(words.map(word => `${word.hanzi}:${word.pinyin}`));
for (const { hanzi, pinyin } of dictionary) {
  if (!seen.has(`${hanzi}:${pinyin}`)) words.push({ hanzi, pinyin });
  seen.add(`${hanzi}:${pinyin}`);
}
console.log(JSON.stringify({ sentences, words }));

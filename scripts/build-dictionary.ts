// Builds lib/dictionary.json from HSK 2.0 levels 1–3 and the editorial files in scripts/dictionary/.
// Usage: node --experimental-strip-types scripts/build-dictionary.ts
// Downloads pinned sources into .cache/dictionary/, writes docs/dictionary-review.md with entries to double-check.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { hsk1Vocabulary } from "../lib/hsk1-vocabulary.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const CACHE = join(ROOT, ".cache/dictionary");
const HSK = "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/7ac65bf1a6387d35f1ade478906172a19311c7f9/wordlists/inclusive";
const UNIHAN = "https://www.unicode.org/Public/17.0.0/ucd/Unihan.zip";

type HskWord = { simplified: string; frequency: number; forms: { transcriptions: { pinyin: string } }[] };
type Entry = { hanzi: string; pinyin: string; hanViet: string; meaning: string; level: 1 | 2 | 3; rank: number };

async function cached(name: string, url: string) {
  const path = join(CACHE, name);
  if (!existsSync(path)) {
    mkdirSync(CACHE, { recursive: true });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    writeFileSync(path, Buffer.from(await response.arrayBuffer()));
  }
  return path;
}

/** "nǚ ér" → "nǚ'ér": syllables joined as in HSK textbooks. */
export function joinSyllables(pinyin: string) {
  return pinyin.trim().split(/\s+/).map((syllable, index) => index > 0 && /^[aeoāáǎàēéěèōóǒò]/i.test(syllable) ? `'${syllable}` : syllable).join("");
}
const toneless = (pinyin: string) => pinyin.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[\s'’-]/g, "").toLowerCase();

const VI_TONES = /[̣̀́̃̉]/g;
/** Compare Vietnamese syllables regardless of old/new tone-mark placement (hoà = hòa). */
const viKey = (syllable: string) => {
  const nfd = syllable.toLowerCase().normalize("NFD");
  return `${nfd.replace(VI_TONES, "").normalize("NFC")}/${(nfd.match(VI_TONES) ?? []).join("")}`;
};

function readCurated() {
  const rows: { hanzi: string; pinyin: string; hanViet: string; meaning: string; extra: boolean }[] = [];
  const dir = join(ROOT, "scripts/dictionary");
  for (const file of readdirSync(dir).filter(name => name.endsWith(".txt")).sort()) {
    let extra = false;
    for (const line of readFileSync(join(dir, file), "utf8").split("\n")) {
      if (line.startsWith("# Có trong đề HSK 1")) extra = true;
      if (!line.trim() || line.startsWith("#")) continue;
      const [hanzi, pinyin, hanViet, meaning, ...rest] = line.split("|").map(part => part.trim());
      if (rest.length || hanViet === undefined || meaning === undefined) throw new Error(`${file}: dòng sai định dạng: ${line}`);
      rows.push({ hanzi, pinyin, hanViet, meaning, extra });
    }
  }
  return rows;
}

async function main() {
  const levels = await Promise.all([1, 2, 3].map(async level => JSON.parse(readFileSync(await cached(`old-${level}.json`, `${HSK}/old/${level}.json`), "utf8")) as HskWord[]));
  const all = JSON.parse(readFileSync(await cached("new-7.min.json", `${HSK}/new/7.min.json`), "utf8")) as { s: string; q: number }[];
  const zip = await cached("Unihan.zip", UNIHAN);
  const readingsFile = join(CACHE, "Unihan_Readings.txt");
  if (!existsSync(readingsFile)) execFileSync("unzip", ["-o", "-q", zip, "Unihan_Readings.txt", "Unihan_Variants.txt", "-d", CACHE]);

  const unihan = new Map<string, string[]>();
  for (const line of readFileSync(readingsFile, "utf8").split("\n")) {
    const [code, field, value] = line.split("\t");
    if (field === "kVietnamese" && code.startsWith("U+")) unihan.set(String.fromCodePoint(parseInt(code.slice(2), 16)), value.split(" "));
  }
  const traditional = new Map<string, string[]>();
  for (const line of readFileSync(join(CACHE, "Unihan_Variants.txt"), "utf8").split("\n")) {
    const [code, field, value] = line.split("\t");
    if (field === "kTraditionalVariant" && code.startsWith("U+")) traditional.set(String.fromCodePoint(parseInt(code.slice(2), 16)), value.split(" ").map(v => String.fromCodePoint(parseInt(v.slice(2), 16))));
  }
  const viReadings = (char: string) => [...new Set([char, ...traditional.get(char) ?? []].flatMap(c => unihan.get(c) ?? []))];

  const source = new Map<string, { level: 1 | 2 | 3; word: HskWord }>();
  for (const [index, words] of levels.entries()) for (const word of words) if (!source.has(word.simplified)) source.set(word.simplified, { level: index + 1 as 1 | 2 | 3, word });
  const frequency = new Map(all.map(word => [word.s, word.q]));

  const errors: string[] = [];
  const review = { pinyin: [] as string[], sandhi: [] as string[], hanViet: [] as string[], missingUnihan: [] as string[] };
  const entries: Entry[] = [];
  const seen = new Set<string>();
  for (const row of readCurated()) {
    if (seen.has(row.hanzi)) errors.push(`Trùng: ${row.hanzi}`);
    seen.add(row.hanzi);
    const fromSource = source.get(row.hanzi);
    const hsk1 = hsk1Vocabulary[row.hanzi];
    if (!fromSource && !(row.extra && hsk1)) { errors.push(`Không có trong HSK 2.0 cấp 1–3: ${row.hanzi}`); continue; }
    const forms = [...new Set(fromSource?.word.forms.map(f => joinSyllables(f.transcriptions.pinyin)) ?? [])];
    const pinyin = row.pinyin || hsk1?.pinyin || (forms.length === 1 ? forms[0] : "");
    if (!pinyin) { errors.push(`Cần ghi Pinyin (nhiều cách đọc ${forms.join(" / ")}): ${row.hanzi}`); continue; }
    if (forms.length) {
      if (!forms.some(form => toneless(form) === toneless(pinyin))) errors.push(`Pinyin không khớp bộ dữ liệu: ${row.hanzi} ${pinyin} (${forms.join(" / ")})`);
      else if (!forms.some(form => form.toLowerCase() === pinyin.replace(/ /g, "").toLowerCase())) {
        (/[一不]/.test(row.hanzi) ? review.sandhi : review.pinyin).push(`| ${row.hanzi} | ${pinyin} | ${forms.join(" / ")} |`);
      }
    }
    const meaning = row.meaning || hsk1?.meaning || "";
    if (!meaning) errors.push(`Thiếu nghĩa: ${row.hanzi}`);
    const syllables = row.hanViet.split(" ");
    const chars = [...row.hanzi];
    if (syllables.length !== chars.length) errors.push(`Số âm Hán Việt khác số chữ: ${row.hanzi} ${row.hanViet}`);
    else chars.forEach((char, index) => {
      const readings = viReadings(char);
      if (!readings.length) review.missingUnihan.push(char);
      else if (!readings.some(reading => viKey(reading) === viKey(syllables[index]))) review.hanViet.push(`| ${char} (${row.hanzi}) | ${syllables[index]} | ${readings.join(", ")} |`);
    });
    entries.push({ hanzi: row.hanzi, pinyin, hanViet: row.hanViet, meaning, level: fromSource?.level ?? 1, rank: fromSource?.word.frequency ?? frequency.get(row.hanzi) ?? 99999 });
  }
  for (const hanzi of source.keys()) if (!seen.has(hanzi)) errors.push(`Chưa biên tập: ${hanzi}`);
  if (errors.length) throw new Error(errors.join("\n"));

  entries.sort((a, b) => a.level - b.level || toneless(a.pinyin).localeCompare(toneless(b.pinyin)) || a.pinyin.localeCompare(b.pinyin) || a.rank - b.rank);
  writeFileSync(join(ROOT, "lib/dictionary.json"), JSON.stringify(entries, null, 0).replace(/\},\{/g, "},\n{") + "\n");

  const unique = (items: string[]) => [...new Set(items)];
  const table = (rows: string[], header: string) => rows.length ? `${header}\n${unique(rows).join("\n")}\n` : "Không có.\n";
  writeFileSync(join(ROOT, "docs/dictionary-review.md"), `# Từ điển: mục cần xem lại

Sinh tự động bởi \`scripts/build-dictionary.ts\`; không sửa tay. ${entries.length} từ (cấp 1: ${entries.filter(e => e.level === 1).length}, cấp 2: ${entries.filter(e => e.level === 2).length}, cấp 3: ${entries.filter(e => e.level === 3).length}).

## Âm Hán Việt khác Unihan

Unihan \`kVietnamese\` chủ yếu ghi âm Nôm/âm đọc khác, nên lệch không có nghĩa là sai. Các mục dưới đã được rà khi biên tập.

${table(review.hanViet, "| Chữ | Đang dùng | Unihan |\n| --- | --- | --- |")}
Chữ không có âm trong Unihan (${unique(review.missingUnihan).length}): ${unique(review.missingUnihan).join(" ") || "không có"}

## Pinyin khác bộ dữ liệu

Chọn cách đọc dùng ở HSK sơ cấp hoặc thống nhất với \`lib/hsk1-vocabulary.ts\`.

${table(review.pinyin, "| Từ | Đang dùng | Bộ dữ liệu |\n| --- | --- | --- |")}
## Biến điệu 一/不

Ghi theo cách đọc thực tế như sách HSK.

${table(review.sandhi, "| Từ | Đang dùng | Bộ dữ liệu |\n| --- | --- | --- |")}`);
  console.log(`Đã ghi ${entries.length} từ; cần xem lại: ${unique(review.hanViet).length} âm Hán Việt, ${review.pinyin.length} Pinyin, ${review.sandhi.length} biến điệu.`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();

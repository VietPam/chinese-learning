export type DictionaryEntry = {
  readonly hanzi: string;
  readonly pinyin: string;
  readonly hanViet: string;
  readonly meaning: string;
  readonly level: 1 | 2 | 3;
  /** Frequency rank: lower is more common. */
  readonly rank: number;
};
export type LevelFilter = 0 | 1 | 2 | 3;

const marks = /[̀-ͯ]/g;
/** "Học sinh" → "hoc sinh". */
export function foldVietnamese(text: string) {
  return text.toLowerCase().normalize("NFD").replace(marks, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
}
/** "Xuéshēng", "xue sheng", "xue2sheng1" → "xuesheng"; ü becomes v (as typed on keyboards) or u. */
export function foldPinyin(text: string, umlaut: "v" | "u" = "v") {
  return text.toLowerCase().normalize("NFD").replace(/u\u0308/g, umlaut).replace(marks, "").replace(/[\s'’\-0-9]/g, "");
}

const HAN = /\p{Script=Han}/u;
// After NFD: macron, caron and diaeresis only occur in pinyin; circumflex, tilde, breve, hook, horn, dot below and đ only in Vietnamese.
const PINYIN_MARKS = /[\u0304\u030c\u0308]/;
const VIETNAMESE_MARKS = /[\u0302\u0303\u0306\u0309\u031b\u0323đ]/;

type Indexed = { entry: DictionaryEntry; pinyinV: string; pinyinU: string; hanViet: string; meaning: string; senses: string[] };
const indexCache = new WeakMap<readonly DictionaryEntry[], Indexed[]>();
function indexOf(entries: readonly DictionaryEntry[]) {
  let index = indexCache.get(entries);
  if (!index) {
    index = entries.map(entry => {
      const meaning = foldVietnamese(entry.meaning);
      return { entry, pinyinV: foldPinyin(entry.pinyin), pinyinU: foldPinyin(entry.pinyin, "u"), hanViet: foldVietnamese(entry.hanViet), meaning, senses: meaning.split(/[;,()]/).map(s => s.trim()).filter(Boolean) };
    });
    indexCache.set(entries, index);
  }
  return index;
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Lower is better; null when the entry does not match. */
function score(item: Indexed, query: string, mode: { pinyin: boolean; vietnamese: boolean }) {
  const { entry } = item;
  if (HAN.test(query)) {
    const han = query.replace(/\s/g, "");
    return entry.hanzi === han ? 0 : entry.hanzi.startsWith(han) ? 1 : entry.hanzi.includes(han) ? 2 : null;
  }
  const p = foldPinyin(query);
  // Typing v or ü means ü; a plain u also finds ü syllables (lu → 路, 绿).
  const pinyin = p.includes("v") ? item.pinyinV : item.pinyinU;
  const v = foldVietnamese(query);
  if (mode.pinyin && p && pinyin === p) return 3;
  if (mode.vietnamese && v) {
    if (item.hanViet === v) return 4;
    if (item.senses.includes(v)) return 5;
  }
  if (mode.pinyin && p && pinyin.startsWith(p)) return 6;
  if (mode.vietnamese && v) {
    const wordStart = new RegExp(`(^|[^a-z])${escape(v)}`);
    if (wordStart.test(item.hanViet)) return 7;
    if (wordStart.test(item.meaning)) return 8;
    if (v.length > 1 && item.meaning.includes(v)) return 9;
  }
  return null;
}

/** Filters by level, then ranks matches for a hanzi, pinyin, Hán Việt or Vietnamese query. */
export function searchDictionary(entries: readonly DictionaryEntry[], query: string, level: LevelFilter = 0): DictionaryEntry[] {
  const items = indexOf(entries).filter(item => level === 0 || item.entry.level === level);
  const trimmed = query.trim().normalize("NFC");
  if (!trimmed) return items.map(item => item.entry);
  const decomposed = trimmed.toLowerCase().normalize("NFD");
  const mode = { pinyin: !VIETNAMESE_MARKS.test(decomposed), vietnamese: !PINYIN_MARKS.test(decomposed) };
  return items
    .map(item => ({ item, score: score(item, trimmed, mode) }))
    .filter((match): match is { item: Indexed; score: number } => match.score !== null)
    .sort((a, b) => a.score - b.score || a.item.entry.rank - b.item.entry.rank)
    .map(match => match.item.entry);
}

export function countByLevel(entries: readonly DictionaryEntry[]) {
  return { 0: entries.length, 1: entries.filter(e => e.level === 1).length, 2: entries.filter(e => e.level === 2).length, 3: entries.filter(e => e.level === 3).length };
}

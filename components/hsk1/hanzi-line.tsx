"use client";

import { Fragment } from "react";
import { tokenize, type Hsk1Line } from "@/lib/hsk1-reading";
import { cn } from "@/lib/utils";

export type WordLookup = { key: string; text: string; pinyin: string; meaning: string };

const speakerPinyin = { "男": "nán", "女": "nǚ" } as const;

function Ruby({ text, pinyin }: { text: string; pinyin: string }) {
  return <ruby lang="zh-Hans">{text}<rt lang="zh-Latn">{pinyin}</rt></ruby>;
}

/**
 * Chinese text with pinyin above each word, as printed on HSK 1 papers.
 * With `onLookup`, words become buttons that report their gloss; `fill` replaces the blank.
 */
export function HanziLine({ line, id, fill, lookup, onLookup, className, as: Tag = "p" }: {
  line: Hsk1Line; id?: string; fill?: string; lookup?: WordLookup | null; onLookup?: (word: WordLookup | null) => void; className?: string; as?: "p" | "span";
}) {
  const tokens = tokenize(line.text);
  const fillTokens = fill ? tokenize(fill) : [];
  return <Tag id={id} className={cn("hanzi-ruby hanzi break-words", Tag === "span" && "block", className)}>
    {line.speaker && <span className="mr-1 text-muted-foreground"><Ruby text={line.speaker} pinyin={speakerPinyin[line.speaker]} />：</span>}
    {tokens.map((token, index) => {
      if (token.kind === "punctuation") return <span key={index} lang="zh-Hans">{token.text}</span>;
      if (token.kind === "blank") {
        return fillTokens.length ? <span key={index} className="rounded-md bg-success-soft px-1 text-success">（{fillTokens.map((word, i) => word.kind === "word" ?
          <Fragment key={i}>{renderWord(word.text, word.pinyin, word.meaning, `${id ?? line.text}-${index}-${i}`)}</Fragment> : null)}）</span> :
          <span key={index} className="inline-block px-0.5"><span className="sr-only">chỗ trống</span><span aria-hidden="true">（<span className="inline-block w-10 border-b-2 border-foreground/40 align-baseline" />）</span></span>;
      }
      return <Fragment key={index}>{renderWord(token.text, token.pinyin, token.meaning, `${id ?? line.text}-${index}`)}</Fragment>;
    })}
  </Tag>;

  function renderWord(text: string, pinyin: string, meaning: string, key: string) {
    if (!onLookup) return <Ruby text={text} pinyin={pinyin} />;
    const pressed = lookup?.key === key;
    return <button type="button" aria-pressed={pressed} aria-label={`Tra từ ${text}`} onClick={() => onLookup(pressed ? null : { key, text, pinyin, meaning })}
      className={cn("hanzi-token rounded-md px-0.5 underline decoration-primary/30 decoration-dotted underline-offset-[6px] hover:bg-secondary", pressed && "bg-secondary text-primary decoration-primary")}>
      <Ruby text={text} pinyin={pinyin} />
    </button>;
  }
}

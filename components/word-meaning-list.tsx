import type { Phrase } from "@/lib/types";

export function WordMeaningList({ words }: { words: Phrase["words"] }) {
  return (
    <section aria-labelledby="word-meanings-title">
      <h3 id="word-meanings-title" className="mb-3 text-sm font-bold">Từng từ, dễ nhớ hơn</h3>
      <dl className="divide-y divide-border/70 rounded-[14px] border bg-muted/60 px-3">
        {words.map((word, index) => (
          <div key={`${word.hanzi}-${index}`} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 py-3">
            <dt className="min-w-0 break-words text-sm leading-6 font-bold text-primary">
              <span lang="zh-Latn">{word.pinyin}</span>
              <span className="hanzi ml-2 font-normal text-muted-foreground" lang="zh-Hans">{word.hanzi}</span>
            </dt>
            <dd className="min-w-0 break-words text-sm leading-6">{word.meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import { SentenceAudio } from "@/components/sentence-audio";
import type { Phrase } from "@/lib/types";
import { WordMeaningList } from "@/components/word-meaning-list";

export function StudyCard({ phrase }: { phrase: Phrase }) {
  return <section className="space-y-3">
    <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-[14px]">
      <div className="flex items-start justify-between gap-2">
      <h1 tabIndex={-1} className="min-w-0 scroll-mt-20 text-2xl leading-snug font-bold outline-none">{phrase.vietnamese}</h1>
      <SentenceAudio key={phrase.id} phrase={phrase} />
      </div>
      <p lang="zh-Latn" className="break-words text-xl leading-relaxed font-bold text-primary">{phrase.pinyin}</p>
      <p lang="zh-Hans" className="hanzi break-words text-2xl leading-relaxed">{phrase.hanzi}</p>
      <p className="text-xs leading-5 text-muted-foreground">Gõ: <span lang="zh-Latn" className="font-semibold text-foreground">{phrase.keyboardInput}</span></p>
    </div>
    <WordMeaningList key={phrase.id} words={phrase.words} withAudio />
    {phrase.note && <p className="text-sm leading-6 text-muted-foreground">{phrase.note}</p>}
  </section>;
}

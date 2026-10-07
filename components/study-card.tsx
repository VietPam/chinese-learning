import type { Phrase } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { WordMeaningList } from "@/components/word-meaning-list";

export function StudyCard({ phrase }: { phrase: Phrase }) {
  return <Card className="gap-5 rounded-3xl border p-5 ring-0 shadow-none">
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground">Học từng từ trong câu</p>
      <h1 tabIndex={-1} className="scroll-mt-24 text-2xl leading-snug font-bold outline-none">{phrase.vietnamese}</h1>
    </div>
    <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
      <p lang="zh-Latn" className="break-words text-xl leading-relaxed font-bold text-primary">{phrase.pinyin}</p>
      <p lang="zh-Hans" className="hanzi break-words text-2xl leading-relaxed">{phrase.hanzi}</p>
      <p className="text-xs leading-5 text-muted-foreground">Gõ không dấu: <span lang="zh-Latn" className="font-semibold text-foreground">{phrase.keyboardInput}</span></p>
    </div>
    <WordMeaningList words={phrase.words} />
    {phrase.note && <p className="text-sm leading-6 text-muted-foreground">{phrase.note}</p>}
  </Card>;
}

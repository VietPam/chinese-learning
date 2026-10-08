"use client";

import { ArrowRight, Check, Keyboard, Lightbulb } from "lucide-react";
import type { Phrase } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WordMeaningList } from "@/components/word-meaning-list";
import { cn } from "@/lib/utils";

export function AnswerFeedback({ phrase, correct, isLast = false, onContinue }: {
  phrase: Phrase; correct: boolean; isLast?: boolean; onContinue?: () => void;
}) {
  return (
    <div className="space-y-4" data-testid="answer-feedback">
      <div className={cn("flex items-start gap-2 rounded-[14px] p-3 text-sm leading-6 font-semibold", correct ? "bg-success-soft text-success" : "bg-error-soft text-destructive")}>
        {correct ? <Check className="mt-1 size-4 shrink-0" aria-hidden="true" /> : <Lightbulb className="mt-1 size-4 shrink-0" aria-hidden="true" />}
        <p>{correct ? "Đúng rồi!" : "Chưa đúng."}</p>
      </div>
      <section className="space-y-4" aria-label="Câu đúng và cách gõ">
        <div>
          <p className="mb-1 text-xs font-semibold text-muted-foreground">PINYIN ĐÚNG</p>
          <p className="break-words text-xl leading-relaxed font-bold text-primary" lang="zh-Latn">{phrase.pinyin}</p>
        </div>
        <div className="rounded-[14px] border border-blue-100 bg-secondary/60 p-3.5">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary"><Keyboard className="size-4" aria-hidden="true" />Gõ không dấu</p>
          <p className="break-words text-base leading-7 font-semibold" lang="zh-Latn">{phrase.keyboardInput}</p>
          <Separator className="my-3 bg-blue-100" />
          <p className="mb-1 text-xs text-muted-foreground">Chữ Hán</p>
          <p lang="zh-Hans" className="hanzi break-words text-2xl leading-relaxed">{phrase.hanzi}</p>
        </div>
      </section>
      <WordMeaningList words={phrase.words} />
      {onContinue && <Button type="button" onClick={onContinue} disabled={!onContinue} className="h-auto min-h-12 w-full rounded-[14px] px-4 py-3 text-base font-bold whitespace-normal">
        <span className="min-w-0 break-words">{isLast ? "Hoàn thành" : "Câu tiếp theo"}</span><ArrowRight className="ml-1 size-4" aria-hidden="true" />
      </Button>}
    </div>
  );
}

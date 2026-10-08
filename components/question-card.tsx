"use client";

import type { Phrase } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnswerOption, type AnswerStatus } from "@/components/answer-option";
import { AnswerFeedback } from "@/components/answer-feedback";

export function QuestionCard({ phrase, options, questionNumber, total, selectedAnswerId, answeredCount, onAnswer, onContinue }: {
  phrase: Phrase; options: readonly Phrase[]; questionNumber: number; total: number;
  selectedAnswerId: string | null; answeredCount?: number; onAnswer?: (id: string) => void; onContinue?: () => void;
}) {
  const answered = selectedAnswerId !== null;
  const count = answeredCount ?? questionNumber - 1 + Number(answered);
  return (
    <Card className="gap-4 rounded-2xl border p-[14px] shadow-[0_1px_2px_rgba(36,85,163,0.03)] ring-0">
      <Progress value={count * 100 / total} aria-label="Tiến độ lượt học" getValueLabel={() => `${count}/${total} câu đã trả lời`} className="h-1.5 bg-secondary" />
      <div className="space-y-2 pt-1">
        <h1 id="question-title" tabIndex={-1} className="scroll-mt-24 text-2xl leading-snug font-bold tracking-tight outline-none">{phrase.vietnamese}</h1>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {answered ? `${selectedAnswerId === phrase.id ? "Đúng rồi." : "Chưa đúng."} Câu đúng: ${phrase.pinyin}.` : ""}
      </p>
      <div role="group" aria-labelledby="question-title" className="space-y-3">
        {options.map((option, index) => {
          const status: AnswerStatus = !answered ? "idle" : option.id === phrase.id ? "correct" : option.id === selectedAnswerId ? "incorrect" : "neutral";
          return <AnswerOption key={option.id} label={String.fromCharCode(65 + index)} pinyin={option.pinyin} status={status} disabled={answered || !onAnswer} onSelect={() => onAnswer?.(option.id)} />;
        })}
      </div>
      {answered ? <AnswerFeedback phrase={phrase} correct={selectedAnswerId === phrase.id} isLast={questionNumber === total} onContinue={onContinue} /> : null}
    </Card>
  );
}

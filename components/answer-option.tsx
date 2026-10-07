"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AnswerStatus = "idle" | "correct" | "incorrect" | "neutral";
export function AnswerOption({ label, pinyin, status = "idle", disabled, onSelect }: {
  label: string; pinyin: string; status?: AnswerStatus; disabled?: boolean; onSelect?: () => void;
}) {
  const correct = status === "correct";
  const incorrect = status === "incorrect";
  return (
    <Button type="button" variant="outline" disabled={disabled} onClick={onSelect}
      className={cn("h-auto min-h-16 w-full justify-start gap-[12px] rounded-[14px] border px-[12px] py-3 text-left whitespace-normal shadow-none disabled:opacity-100",
        status === "idle" && "bg-white hover:border-primary/40 hover:bg-secondary",
        correct && "border-success/40 bg-success-soft text-success hover:bg-success-soft hover:text-success",
        incorrect && "border-destructive/35 bg-error-soft text-destructive hover:bg-error-soft hover:text-destructive",
        status === "neutral" && "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground")}
      aria-label={`${label}. ${pinyin}${correct ? ". Đáp án đúng" : incorrect ? ". Bạn chọn chưa đúng" : ""}`}>
      <span aria-hidden="true" className={cn("flex size-[32px] shrink-0 items-center justify-center rounded-[10px] border bg-muted text-sm font-bold", correct && "border-success/20 bg-white text-success", incorrect && "border-destructive/20 bg-white text-destructive")}>
        {correct ? <Check className="size-4" /> : incorrect ? <X className="size-4" /> : label}
      </span>
      <span className="min-w-0 break-words text-lg leading-relaxed font-semibold" lang="zh-Latn">{pinyin}</span>
    </Button>
  );
}

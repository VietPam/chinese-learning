"use client";

import { useRef } from "react";
import type { Phrase } from "@/lib/types";
import { checkHanzi, normalizeHanzi, type TypingAttempt } from "@/lib/typing";
import { Card } from "@/components/ui/card";

export function TypingCard({ phrase, attempt, onChange }: { phrase: Phrase; attempt: TypingAttempt; onChange: (attempt: TypingAttempt) => void }) {
  const composing = useRef(false);
  const compositionEnded = useRef(-Infinity);
  const input = useRef<HTMLInputElement>(null);
  function submit() {
    // Safari may end composition immediately before delivering its confirming Enter.
    if (composing.current || performance.now() - compositionEnded.current < 100) return;
    const text = input.current?.value ?? attempt.text;
    const result = !normalizeHanzi(text) ? "empty" : checkHanzi(text, phrase.hanzi) ? "correct" : "incorrect";
    onChange({ text, result });
    if (result !== "empty") input.current?.blur();
  }
  return <Card className="gap-5 rounded-3xl border p-5 ring-0 shadow-none">
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground">Gõ cả câu bằng chữ Hán</p>
      <h1 tabIndex={-1} className="scroll-mt-24 text-2xl leading-snug font-bold outline-none">{phrase.vietnamese}</h1>
    </div>
    <div className="space-y-2 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
      <p lang="zh-Latn" className="break-words text-xl leading-relaxed font-bold text-primary">{phrase.pinyin}</p>
      <p className="text-xs leading-6 text-muted-foreground">Gõ không dấu: <span lang="zh-Latn" className="font-semibold text-foreground">{phrase.keyboardInput}</span></p>
    </div>
    <form onSubmit={event => { event.preventDefault(); submit(); }} className="space-y-3">
      <label htmlFor="hanzi-input" className="block text-sm font-bold">Nhập chữ Hán</label>
      <input ref={input} id="hanzi-input" name="hanzi" type="text" lang="zh-Hans" enterKeyHint="done" autoComplete="off" autoCapitalize="none" spellCheck={false}
        aria-describedby="typing-help typing-result" aria-invalid={attempt.result === "incorrect" || attempt.result === "empty"}
        value={attempt.text} onChange={event => onChange({ text: event.target.value, result: null })}
        onCompositionStart={() => { composing.current = true; }}
        onCompositionEnd={() => { composing.current = false; compositionEnded.current = performance.now(); }}
        onKeyDown={event => {
          if (event.key !== "Enter") return;
          if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229 || composing.current) {
            compositionEnded.current = performance.now();
            return;
          }
          event.preventDefault(); submit();
        }}
        className="hanzi min-h-14 w-full min-w-0 rounded-2xl border bg-white px-4 py-3 text-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
      <p id="typing-help" className="text-xs leading-5 text-muted-foreground">Chọn chữ Hán trên bàn phím tiếng Trung, rồi nhấn Enter (Xong) để kiểm tra. Có thể bỏ dấu câu.</p>
    </form>
    <div id="typing-result" role="status" aria-live="polite" aria-atomic="true">
      {attempt.result && <div className={`space-y-2 rounded-2xl p-4 ${attempt.result === "correct" ? "bg-success-soft text-success" : "bg-error-soft text-destructive"}`}>
        <p className="text-sm leading-6 font-bold">{attempt.result === "correct" ? "Đúng rồi! Nhìn lại mặt chữ nhé." : attempt.result === "empty" ? "Nhập chữ Hán trước khi kiểm tra nhé." : "Chưa đúng. Sửa lại và thử tiếp nhé."}</p>
        {attempt.result !== "empty" && <><p className="text-xs">Câu đúng</p><p lang="zh-Hans" className="hanzi break-words text-2xl leading-relaxed">{phrase.hanzi}</p></>}
      </div>}
    </div>
  </Card>;
}

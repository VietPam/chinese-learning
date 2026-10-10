"use client";

import { useEffect, useReducer, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, X } from "lucide-react";
import { PASS_SCORE, hsk1Questions, hsk1Reducer, hsk1Sections, initialHsk1State, scoreHsk1 } from "@/lib/hsk1-reading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hsk1QuestionCard } from "@/components/hsk1/hsk1-question";
import { cn } from "@/lib/utils";

const total = hsk1Questions.length;

function Hsk1Header({ number, onPrevious, onNext }: { number?: number; onPrevious?: () => void; onNext?: () => void }) {
  return <header className="sticky top-0 z-10 border-b bg-white/95 px-3 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
    <div className="flex min-h-[52px] items-center gap-2 py-1">
      <Button asChild variant="ghost" size="icon" className="size-[44px] shrink-0 rounded-xl">
        <Link href="/" aria-label="Thoát về trang học"><X className="size-5" aria-hidden="true" /></Link>
      </Button>
      <p className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground">
        {number ? <>Câu <span className="text-primary tabular-nums">{number}</span>/{total}</> : "Đọc HSK 1"}
      </p>
      {number && <>
        <Button variant="ghost" size="icon" aria-label="Câu trước" className="size-[44px] shrink-0 rounded-xl" disabled={number === 1} onClick={onPrevious}>
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Câu tiếp theo" className="size-[44px] shrink-0 rounded-xl" disabled={number === total} onClick={onNext}>
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
      </>}
    </div>
  </header>;
}

const stats = [["20", "câu"], ["4", "phần"], ["Không", "tính giờ"], ["100", "điểm"]] as const;

function Hsk1Intro({ onStart }: { onStart: () => void }) {
  return <Card className="gap-4 rounded-2xl border p-4 shadow-none ring-0">
    <Badge variant="secondary" className="h-6 px-2.5 text-xs font-bold">HSK 1 · Đọc hiểu</Badge>
    <div className="space-y-2">
      <h1 tabIndex={-1} className="text-2xl leading-snug font-bold outline-none">Đề Đọc HSK 1 – Đề 1</h1>
      <p className="text-sm leading-6 text-muted-foreground">Đề luyện tập do AI soạn theo cấu trúc phần Đọc HSK 1 (HSK 2.0), chỉ dùng từ HSK 1. Chọn đáp án là thấy đúng/sai và giải thích ngay.</p>
    </div>
    <dl className="grid grid-cols-4 gap-2 text-center">
      {stats.map(([value, label]) => <div key={label} className="flex flex-col-reverse rounded-xl bg-secondary px-1 py-2">
        <dt className="text-xs text-slate-600">{label}</dt>
        <dd className="text-base font-bold text-primary">{value}</dd>
      </div>)}
    </dl>
    <section aria-labelledby="hsk-structure" className="space-y-2">
      <h2 id="hsk-structure" className="text-sm font-bold">Cấu trúc đề</h2>
      <ol className="space-y-2">
        {hsk1Sections.map(section => <li key={section.part} className="rounded-xl border p-3">
          <p className="text-xs font-bold text-primary">Phần {section.part} · Câu {section.part * 5 - 4}–{section.part * 5}</p>
          <p className="text-sm leading-6">{section.summary}</p>
        </li>)}
      </ol>
    </section>
    <Button type="button" onClick={onStart} className="h-auto min-h-12 w-full rounded-[14px] px-4 py-3 text-base font-bold whitespace-normal">Bắt đầu làm bài</Button>
  </Card>;
}

export function Hsk1Reading() {
  const [state, dispatch] = useReducer(hsk1Reducer, initialHsk1State);
  const contentRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);
  const question = hsk1Questions[state.index];
  const answered = Object.keys(state.answers).length;
  const missing = total - answered;

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    contentRef.current?.querySelector("h1")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state.stage, state.index]);

  function go(action: Parameters<typeof dispatch>[0]) {
    moveFocus.current = true;
    dispatch(action);
  }
  const result = state.stage === "result" ? scoreHsk1(state.answers) : null;
  return <>
    <Hsk1Header number={state.stage === "question" ? question.number : undefined}
      onPrevious={() => go({ type: "GO", index: state.index - 1 })} onNext={() => go({ type: "GO", index: state.index + 1 })} />
    <main className="safe-bottom space-y-3 px-3 pt-3">
      <div ref={contentRef} className="space-y-4">
        {state.stage === "intro" ? <Hsk1Intro onStart={() => go({ type: "START" })} /> :
          result ? <ResultCard result={result} onReview={index => go({ type: "GO", index })} onRestart={() => go({ type: "RESTART" })} /> : <>
            <Hsk1QuestionCard key={question.id} question={question} total={total} answeredCount={answered} answer={state.answers[question.id]}
              onAnswer={answer => dispatch({ type: "ANSWER", questionId: question.id, answer })}
              onContinue={state.index < total - 1 ? () => go({ type: "GO", index: state.index + 1 }) : undefined} />
            {(state.index === total - 1 || missing === 0) && <section aria-label="Kết thúc bài làm" className="space-y-3 rounded-2xl border bg-white p-4">
              <p className="text-sm leading-6 text-muted-foreground">{missing ? `Còn ${missing} câu chưa làm.` : `Bạn đã làm đủ ${total} câu.`}</p>
              <Button className="h-auto min-h-12 w-full whitespace-normal py-3" onClick={() => go({ type: missing ? "MISSING" : "FINISH" })}>{missing ? "Làm câu còn thiếu" : "Xem kết quả"}</Button>
            </section>}
          </>}
      </div>
    </main>
  </>;
}

function ResultCard({ result, onReview, onRestart }: { result: ReturnType<typeof scoreHsk1>; onReview: (index: number) => void; onRestart: () => void }) {
  return <Card className="gap-4 rounded-2xl border p-4 shadow-none ring-0">
    <div className="space-y-1 text-center">
      <h1 tabIndex={-1} className="text-lg font-bold outline-none">Kết quả bài đọc</h1>
      <p className="text-5xl font-bold text-primary tabular-nums">{result.score}<span className="text-2xl text-muted-foreground">/100</span></p>
      <p className="text-sm text-muted-foreground">Đúng {result.correct}/{result.total} câu · mỗi câu 5 điểm</p>
    </div>
    <p className={cn("rounded-[14px] p-3 text-center text-sm leading-6 font-semibold", result.passed ? "bg-success-soft text-success" : "bg-error-soft text-destructive")}>
      {result.passed ? `Đạt mốc tham khảo ${PASS_SCORE}/100` : `Chưa đạt mốc tham khảo ${PASS_SCORE}/100`}
    </p>
    <table className="w-full text-left text-sm leading-6">
      <caption className="sr-only">Số câu đúng từng phần</caption>
      <thead className="text-xs text-muted-foreground"><tr><th scope="col" className="py-1 font-semibold">Phần</th><th scope="col" className="py-1 text-right font-semibold">Đúng</th></tr></thead>
      <tbody className="divide-y divide-border/70">
        {result.byPart.map(part => <tr key={part.part}>
          <th scope="row" className="py-2 font-semibold">Phần {part.part} · {hsk1Sections[part.part - 1].instruction}</th>
          <td className="py-2 text-right font-bold tabular-nums">{part.correct}/{part.total}</td>
        </tr>)}
      </tbody>
    </table>
    {result.wrong.length > 0 && <section aria-labelledby="hsk-review" className="space-y-2">
      <h2 id="hsk-review" className="text-sm font-bold">Xem lại câu sai</h2>
      <div className="flex flex-wrap gap-2">
        {result.wrong.map(q => <Button key={q.id} type="button" variant="outline" onClick={() => onReview(q.number - 1)}
          className="h-11 min-w-11 rounded-xl border-destructive/30 bg-error-soft px-3 text-sm font-bold text-destructive hover:bg-error-soft hover:text-destructive">Câu {q.number}</Button>)}
      </div>
    </section>}
    <p className="text-xs leading-5 text-muted-foreground">HSK 1 thật chấm cả Nghe và Đọc, đạt khi tổng điểm từ 120/200. Mốc {PASS_SCORE}/100 ở đây chỉ để tự đánh giá phần Đọc.</p>
    <Button type="button" onClick={onRestart} className="h-auto min-h-12 w-full rounded-[14px] px-4 py-3 text-base font-bold whitespace-normal">
      <RotateCcw className="mr-1 size-4" aria-hidden="true" />Làm lại từ đầu
    </Button>
    <Button asChild variant="outline" className="h-auto min-h-12 w-full rounded-[14px] px-4 py-3 text-base font-bold">
      <Link href="/">Về trang học</Link>
    </Button>
  </Card>;
}

"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Lightbulb, X } from "lucide-react";
import {
  LETTERS, letterIndex, sectionOf, type Hsk1Answer, type Hsk1Item, type Hsk1Line, type Hsk1Picture, type Hsk1Question, type Letter,
} from "@/lib/hsk1-reading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HanziLine, type WordLookup } from "@/components/hsk1/hanzi-line";
import { cn } from "@/lib/utils";

type ChoiceStatus = "idle" | "correct" | "incorrect" | "neutral" | "example";

function Picture({ picture, size = "lg" }: { picture: Hsk1Picture; size?: "sm" | "md" | "lg" }) {
  return <span role="img" aria-label={`Tranh: ${picture.label}`} className={cn("emoji leading-none", size === "lg" ? "text-7xl" : size === "md" ? "text-4xl" : "text-2xl")}>{picture.emoji}</span>;
}

function ChoiceButton({ letter, status, disabled, label, onSelect, className, children }: {
  letter: ReactNode; status: ChoiceStatus; disabled: boolean; label: string; onSelect: () => void; className?: string; children: ReactNode;
}) {
  const suffix = status === "correct" ? ". Đáp án đúng" : status === "incorrect" ? ". Bạn chọn chưa đúng" : status === "example" ? ". Đã dùng ở ví dụ" : "";
  return <Button type="button" variant="outline" disabled={disabled || status === "example"} onClick={onSelect} aria-label={label + suffix}
    className={cn("relative h-auto min-h-14 w-full gap-2 rounded-[14px] border px-3 py-2.5 whitespace-normal shadow-none disabled:opacity-100", className,
      status === "idle" && "bg-white hover:border-primary/40 hover:bg-secondary",
      status === "correct" && "border-success/40 bg-success-soft text-success hover:bg-success-soft hover:text-success",
      status === "incorrect" && "border-destructive/35 bg-error-soft text-destructive hover:bg-error-soft hover:text-destructive",
      (status === "neutral" || status === "example") && "bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground")}>
    <span aria-hidden="true" className={cn("flex size-7 shrink-0 items-center justify-center rounded-[9px] border bg-muted text-sm font-bold",
      status === "correct" && "border-success/20 bg-white text-success", status === "incorrect" && "border-destructive/20 bg-white text-destructive")}>
      {status === "correct" ? <Check className="size-4" /> : status === "incorrect" ? <X className="size-4" /> : letter}
    </span>
    {children}
    {status === "example" && <span aria-hidden="true" className="absolute top-1 right-1.5 text-[11px] font-bold">Ví dụ</span>}
  </Button>;
}

/** The Chinese prompt of an item; part 4 shows the answer in the blank once it is known. */
function Prompt({ item, part, fill, id }: { item: Hsk1Item; part: number; fill?: string; id?: string }) {
  if (part === 1) return <div className="flex items-center gap-4 rounded-2xl border bg-muted/60 p-3">
    <span className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-white"><Picture picture={item.picture!} /></span>
    <HanziLine id={id} line={item.lines[0]} className="text-3xl leading-[2.4]" />
  </div>;
  return <div id={id} className="space-y-1">
    {item.lines.map((line, index) => <HanziLine key={index} line={line} fill={fill} className="text-2xl leading-[2.3]" />)}
  </div>;
}

function choiceText(part: Hsk1Question["part"], letter: Letter) {
  return sectionOf(part).choices[letterIndex(letter)].line?.text;
}
function answerText(question: Pick<Hsk1Item, "answer">) {
  return question.answer === "match" ? "✓ Khớp" : question.answer === "mismatch" ? "✗ Không khớp" : question.answer;
}

function ExampleDetails({ part }: { part: Hsk1Question["part"] }) {
  const { example, choices } = sectionOf(part);
  const answer = example.answer;
  const picked = part === 1 ? null : choices[letterIndex(answer as Letter)];
  return <details className="group rounded-[14px] border border-dashed bg-white px-3 py-2 text-sm">
    <summary className="flex min-h-9 cursor-pointer items-center font-semibold text-primary">Xem ví dụ</summary>
    <div className="space-y-2 pt-2 pb-1">
      <Prompt item={example} part={part} fill={part === 4 ? choiceText(part, answer as Letter) : undefined} />
      <p className="flex flex-wrap items-center gap-2 font-semibold">
        Đáp án: {part === 1 ? answerText(example) : <>
          {answer}{picked?.picture && <Picture picture={picked.picture} size="sm" />}
          {part === 3 && picked?.line && <HanziLine as="span" line={picked.line} className="text-lg leading-[2.2] font-normal" />}
        </>}
      </p>
      <p className="leading-6 text-muted-foreground">{example.explanation}</p>
    </div>
  </details>;
}

function Choices({ question, answer, onAnswer, titleId }: {
  question: Hsk1Question; answer: Hsk1Answer | undefined; onAnswer: (answer: Hsk1Answer) => void; titleId: string;
}) {
  const answered = answer !== undefined;
  const status = (value: Hsk1Answer, isExample = false): ChoiceStatus => isExample ? "example" : !answered ? "idle" :
    value === question.answer ? "correct" : value === answer ? "incorrect" : "neutral";
  const group = (children: ReactNode, className: string) => <div role="group" aria-labelledby={titleId} className={className}>{children}</div>;
  if (question.part === 1) {
    return group(([["match", "✓", "Khớp"], ["mismatch", "✗", "Không khớp"]] as const).map(([value, mark, label]) =>
      <ChoiceButton key={value} letter={mark} status={status(value)} disabled={answered} label={label} onSelect={() => onAnswer(value)} className="justify-center">
        <span className="text-base font-bold">{label}</span>
      </ChoiceButton>), "grid grid-cols-2 gap-2");
  }
  const section = sectionOf(question.part);
  return group(section.choices.map((choice, index) => {
    const letter = LETTERS[index];
    const isExample = letter === section.example.answer;
    const label = choice.picture ? `${letter}. Tranh: ${choice.picture.label}` : `${letter}. ${choice.line!.text.replaceAll(" ", "")}`;
    return <ChoiceButton key={letter} letter={letter} status={status(letter, isExample)} disabled={answered} label={label} onSelect={() => onAnswer(letter)}
      className={question.part === 3 ? "justify-start text-left" : "flex-col justify-center py-3"}>
      {choice.picture ? <Picture picture={choice.picture} size="md" /> :
        <HanziLine as="span" line={choice.line!} className={cn("font-normal text-foreground", question.part === 3 ? "text-xl leading-[2.2]" : "text-2xl leading-[2.2]")} />}
    </ChoiceButton>;
  }), question.part === 3 ? "space-y-2" : "grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-2");
}

function Explanation({ question, correct, onContinue }: { question: Hsk1Question; correct: boolean; onContinue?: () => void }) {
  const [lookup, setLookup] = useState<WordLookup | null>(null);
  const section = sectionOf(question.part);
  const answerChoice = question.part === 1 ? null : section.choices[letterIndex(question.answer as Letter)];
  const rows: { label?: string; line: Hsk1Line; fill?: string }[] = question.part === 4 ?
    question.lines.map(line => ({ line, fill: answerChoice!.line!.text })) :
    [
      ...question.lines.map(line => ({ line, label: question.part === 1 ? "Từ" : question.part === 3 ? "Câu hỏi" : undefined })),
      ...question.pictureWord ? [{ label: "Tranh", line: { text: question.pictureWord, vi: question.picture!.label } }] : [],
      ...question.part === 3 ? [{ label: `Đáp án ${question.answer}`, line: answerChoice!.line! }] : [],
    ];
  return <div className="space-y-4" data-testid="answer-feedback">
    <div className={cn("flex items-start gap-2 rounded-[14px] p-3 text-sm leading-6 font-semibold", correct ? "bg-success-soft text-success" : "bg-error-soft text-destructive")}>
      {correct ? <Check className="mt-1 size-4 shrink-0" aria-hidden="true" /> : <Lightbulb className="mt-1 size-4 shrink-0" aria-hidden="true" />}
      <p>{correct ? "Đúng rồi!" : `Chưa đúng. Đáp án: ${answerText(question)}.`}</p>
    </div>
    <p className="text-base leading-7">{question.explanation}</p>
    <section aria-label="Câu và nghĩa" className="space-y-3 rounded-[14px] border border-blue-100 bg-secondary/60 p-3">
      <p className="text-xs font-semibold text-primary">Chạm vào chữ Hán để xem Pinyin và nghĩa</p>
      {rows.map((row, index) => <div key={index}>
        {row.label && <p className="text-xs font-semibold text-slate-600">{row.label}</p>}
        <HanziLine id={`explain-${index}`} line={row.line} fill={row.fill} lookup={lookup} onLookup={setLookup} className="text-2xl leading-[2.3]" />
        <p className="text-sm leading-6 text-slate-600">{row.line.vi}</p>
      </div>)}
      <div role="status" aria-live="polite" className="min-h-0">
        {lookup && <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border bg-white p-3">
          <span lang="zh-Hans" className="hanzi text-2xl">{lookup.text}</span>
          <span lang="zh-Latn" className="text-lg font-bold text-primary">{lookup.pinyin}</span>
          <span className="text-base">{lookup.meaning}</span>
        </p>}
      </div>
    </section>
    {onContinue && <Button type="button" onClick={onContinue} className="h-auto min-h-12 w-full rounded-[14px] px-4 py-3 text-base font-bold whitespace-normal">
      Câu tiếp theo<ArrowRight className="ml-1 size-4" aria-hidden="true" />
    </Button>}
  </div>;
}

export function Hsk1QuestionCard({ question, total, answeredCount, answer, onAnswer, onContinue }: {
  question: Hsk1Question; total: number; answeredCount: number; answer: Hsk1Answer | undefined;
  onAnswer: (answer: Hsk1Answer) => void; onContinue?: () => void;
}) {
  const section = sectionOf(question.part);
  const answered = answer !== undefined;
  const correct = answer === question.answer;
  const titleId = `hsk-title-${question.id}`;
  return <Card className="gap-4 rounded-2xl border p-[14px] shadow-[0_1px_2px_rgba(36,85,163,0.03)] ring-0">
    <Progress value={answeredCount * 100 / total} aria-label="Tiến độ làm bài" getValueLabel={() => `${answeredCount}/${total} câu đã làm`} className="h-1.5 bg-secondary" />
    <div className="space-y-1">
      <p className="text-xs font-bold tracking-wide text-primary">PHẦN {question.part} · CÂU {question.number}/{total}</p>
      <h1 id={titleId} tabIndex={-1} className="scroll-mt-24 text-xl leading-snug font-bold outline-none">{section.instruction}</h1>
    </div>
    <ExampleDetails part={question.part} />
    <Prompt item={question} part={question.part} fill={answered && question.part === 4 ? choiceText(4, question.answer as Letter) : undefined} />
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {answered ? correct ? "Đúng rồi." : `Chưa đúng. Đáp án đúng: ${answerText(question).replace(/^[✓✗] /, "")}.` : ""}
    </p>
    <Choices question={question} answer={answer} onAnswer={onAnswer} titleId={titleId} />
    {answered && <Explanation key={question.id} question={question} correct={correct} onContinue={onContinue} />}
  </Card>;
}

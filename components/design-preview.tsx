"use client";

import { useState } from "react";
import { phrases } from "@/lib/content";
import { LearningHeader } from "@/components/learning-header";
import { QuestionCard } from "@/components/question-card";
import { SessionComplete } from "@/components/session-complete";

type Scenario = "question" | "correct" | "incorrect" | "long" | "long-feedback" | "complete";
const scenarios: { id: Scenario; label: string }[] = [
  { id: "question", label: "Câu hỏi" }, { id: "correct", label: "Đúng" },
  { id: "incorrect", label: "Sai" }, { id: "long", label: "Câu dài" },
  { id: "long-feedback", label: "Giải thích dài" }, { id: "complete", label: "Hoàn thành" },
];

/** Development-only visual fixtures. The complete quiz flow belongs to phase 4. */
export function DesignPreview() {
  const [scenario, setScenario] = useState<Scenario>("question");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const phrase = phrases[scenario.startsWith("long") ? 10 : 0];
  const options = [phrase.distractorIds[0], phrase.id, phrase.distractorIds[1]].map(id => phrases.find(p => p.id === id)!);
  const selected = selectedId ?? (scenario === "correct" || scenario === "long-feedback" ? phrase.id : scenario === "incorrect" ? phrase.distractorIds[0] : null);
  function change(next: Scenario) { setScenario(next); setSelectedId(null); window.scrollTo({ top: 0 }); }
  return (
    <>
      <LearningHeader questionNumber={scenario === "complete" ? phrases.length : scenario.startsWith("long") ? 11 : 1} total={phrases.length} />
      <main className="safe-bottom space-y-3 px-3 pt-3">
        {scenario === "complete" ? <SessionComplete total={phrases.length} onRestart={() => change("question")} /> :
          <QuestionCard phrase={phrase} options={options} questionNumber={scenario.startsWith("long") ? 11 : 1} total={phrases.length} selectedAnswerId={selected} onAnswer={setSelectedId} onContinue={() => change("complete")} />}
        <aside aria-label="Công cụ xem trước thiết kế" className="rounded-2xl border border-dashed bg-white p-3">
          <p className="mb-3 text-xs font-bold text-muted-foreground">PREVIEW GIAO DIỆN · CHỈ DÙNG KHI PHÁT TRIỂN</p>
          <div className="flex flex-wrap gap-2">
            {scenarios.map(item => <button type="button" key={item.id} onClick={() => change(item.id)} aria-pressed={scenario === item.id} className="min-h-11 rounded-lg border px-3 text-xs font-semibold aria-pressed:bg-secondary aria-pressed:text-primary">{item.label}</button>)}
          </div>
        </aside>
      </main>
    </>
  );
}

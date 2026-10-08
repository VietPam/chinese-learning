"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { phrases } from "@/lib/content";
import { createQuizSession, getQuizProgress, quizReducer, type QuizState } from "@/lib/quiz";
import type { TypingAttempt } from "@/lib/typing";
import { LearningHeader } from "@/components/learning-header";
import { QuestionCard } from "@/components/question-card";
import { SessionComplete } from "@/components/session-complete";
import { StudyCard } from "@/components/study-card";
import { TypingCard } from "@/components/typing-card";
import { LearningNavigation, type LearningMode } from "@/components/learning-navigation";
import { Button } from "@/components/ui/button";

const phraseById = new Map(phrases.map(phrase => [phrase.id, phrase]));
const emptyAttempt: TypingAttempt = { text: "", result: null };

export function PinyinQuiz({ initialSession }: { initialSession: QuizState }) {
  const [state, dispatch] = useReducer(quizReducer, initialSession);
  const [mode, setMode] = useState<LearningMode>("quiz");
  const [learnIndex, setLearnIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, TypingAttempt>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);
  const index = mode === "quiz" ? state.questionIndex : mode === "learn" ? learnIndex : typingIndex;
  const question = mode === "quiz" ? phraseById.get(state.questionIds[index])! : phrases[index];
  const context = { sessionId: state.sessionId, questionId: state.questionIds[state.questionIndex] };
  const progress = getQuizProgress(state);
  const missing = phrases.length - progress.answered;

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    contentRef.current?.querySelector("h1")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [index, mode, state.isComplete, state.sessionId]);

  function move(direction: -1 | 1) {
    moveFocus.current = true;
    if (mode === "quiz") dispatch({ type: direction === 1 ? "NEXT" : "PREVIOUS", ...context });
    else if (mode === "learn") setLearnIndex(Math.max(0, Math.min(phrases.length - 1, index + direction)));
    else setTypingIndex(Math.max(0, Math.min(phrases.length - 1, index + direction)));
  }
  function finishOrReview() {
    moveFocus.current = true;
    dispatch({ type: missing ? "MISSING" : "COMPLETE", ...context });
  }
  function restart() {
    moveFocus.current = true;
    dispatch({ type: "RESET", session: createQuizSession(crypto.randomUUID()) });
  }
  return <>
    <LearningHeader questionNumber={mode === "quiz" && state.isComplete ? phrases.length : index + 1} total={phrases.length} onPrevious={() => move(-1)} onNext={() => move(1)} complete={mode === "quiz" && state.isComplete} />
    <main className="learning-main space-y-3 px-3 pt-3">
      <div ref={contentRef} className="space-y-4">
        {mode === "quiz" ? state.isComplete ? <SessionComplete total={phrases.length} onRestart={restart} /> :
          <QuestionCard phrase={question} options={state.optionIdsByQuestion[index].map(id => phraseById.get(id)!)} questionNumber={mode === "quiz" && state.isComplete ? phrases.length : index + 1} total={phrases.length}
            selectedAnswerId={state.selectedAnswerId} answeredCount={progress.answered} onAnswer={answerId => dispatch({ type: "ANSWER", ...context, answerId })} /> :
          mode === "learn" ? <StudyCard phrase={question} /> :
            <TypingCard key={question.id} phrase={question} attempt={attempts[question.id] ?? emptyAttempt} onChange={attempt => setAttempts(previous => ({ ...previous, [question.id]: attempt }))} />}
        {mode === "quiz" && !state.isComplete && (index === phrases.length - 1 || missing === 0) &&
          <section aria-label="Kết thúc lượt quiz" className="space-y-3 rounded-2xl border bg-white p-4">
            <p className="text-sm leading-6 text-muted-foreground">{missing ? `Còn ${missing} câu chưa trả lời.` : `Bạn đã trả lời đủ ${phrases.length} câu.`}</p>
            <Button className="h-auto min-h-12 w-full whitespace-normal py-3" onClick={finishOrReview}>{missing ? "Làm câu còn thiếu" : "Hoàn thành"}</Button>
          </section>}
      </div>
    </main>
    <LearningNavigation mode={mode} onChange={next => { if (next !== mode) { moveFocus.current = true; setMode(next); } }} />
  </>;
}

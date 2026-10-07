"use client";

import { useEffect, useReducer, useRef } from "react";
import { phrases } from "@/lib/content";
import { createQuizSession, quizReducer, type QuizState } from "@/lib/quiz";
import { LearningHeader } from "@/components/learning-header";
import { QuestionCard } from "@/components/question-card";
import { SessionComplete } from "@/components/session-complete";

const phraseById = new Map(phrases.map(phrase => [phrase.id, phrase]));

export function PinyinQuiz({ initialSession }: { initialSession: QuizState }) {
  const [state, dispatch] = useReducer(quizReducer, initialSession);
  const contentRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);
  const question = phrases[state.questionIndex];
  const context = { sessionId: state.sessionId, questionId: question.id };

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    const heading = contentRef.current?.querySelector("h1");
    heading?.focus({ preventScroll: true });
    // Instant scrolling avoids a second tap hitting controls while they move.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state.questionIndex, state.isComplete, state.sessionId]);

  function continueLearning() {
    if (state.selectedAnswerId === null || state.isComplete) return;
    moveFocus.current = true;
    dispatch({ type: state.questionIndex === phrases.length - 1 ? "COMPLETE" : "NEXT", ...context });
  }

  function restart() {
    moveFocus.current = true;
    dispatch({ type: "RESET", session: createQuizSession(crypto.randomUUID()) });
  }

  return (
    <>
      <LearningHeader />
      <main className="safe-bottom space-y-5 px-[16px] pt-6">
        <div className="px-1">
          <p className="mb-1 text-lg font-bold">Một câu nhỏ, thêm gần nhau</p>
          <p className="text-sm leading-6 text-muted-foreground">20 câu nhắn tin cùng người thương.</p>
        </div>
        <div ref={contentRef}>
          {state.isComplete ? <SessionComplete total={phrases.length} onRestart={restart} /> :
            <QuestionCard
              key={`${state.sessionId}-${question.id}`}
              phrase={question}
              options={state.optionIdsByQuestion[state.questionIndex].map(id => phraseById.get(id)!)}
              questionNumber={state.questionIndex + 1}
              total={phrases.length}
              selectedAnswerId={state.selectedAnswerId}
              onAnswer={answerId => dispatch({ type: "ANSWER", ...context, answerId })}
              onContinue={continueLearning}
            />}
        </div>
        <p className="px-4 text-center text-xs leading-5 text-muted-foreground">Học một chút. Nhớ thêm một câu.</p>
      </main>
    </>
  );
}

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LearningHeader({ questionNumber, total, onPrevious, onNext, complete = false }: {
  questionNumber: number; total: number; onPrevious?: () => void; onNext?: () => void; complete?: boolean;
}) {
  return <header className="sticky top-0 z-10 border-b bg-white/95 px-3 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
    <div className="flex min-h-[52px] items-center justify-between gap-2 py-1">
      <Button variant="ghost" size="icon" aria-label="Câu trước" className="size-[44px] shrink-0 rounded-xl" disabled={complete || questionNumber === 1 || !onPrevious} onClick={onPrevious}>
        <ArrowLeft className="size-5" aria-hidden="true" />
      </Button>
      <p className="text-sm font-semibold tabular-nums text-muted-foreground">Câu <span className="text-primary">{questionNumber}</span>/{total}</p>
      <Button variant="ghost" size="icon" aria-label="Câu tiếp theo" className="size-[44px] shrink-0 rounded-xl" disabled={complete || questionNumber === total || !onNext} onClick={onNext}>
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </div>
  </header>;
}

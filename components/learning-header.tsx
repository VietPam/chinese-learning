import { MessagesSquare } from "lucide-react";

export function LearningHeader({ questionNumber, total }: { questionNumber: number; total: number }) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="flex min-h-16 items-center justify-between gap-x-3 gap-y-2 flex-wrap py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-[36px] shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-secondary text-primary">
            <MessagesSquare className="size-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight">Pinyin <span className="text-primary">mỗi ngày</span></span>
        </div>
        <p className="ml-auto shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
          Câu <span className="text-primary">{questionNumber}</span>/{total}
        </p>
      </div>
    </header>
  );
}

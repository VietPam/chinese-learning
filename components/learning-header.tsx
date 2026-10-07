import { Heart, MessagesSquare } from "lucide-react";

export function LearningHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="flex min-h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl border border-blue-100 bg-secondary text-primary">
            <MessagesSquare className="size-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight">Pinyin <span className="text-primary">mỗi ngày</span></span>
        </div>
        <span className="flex size-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600" aria-hidden="true">
          <Heart className="size-4" aria-hidden="true" />
        </span>
      </div>
    </header>
  );
}

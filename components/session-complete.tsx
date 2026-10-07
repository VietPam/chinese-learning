"use client";

import { Heart, RotateCcw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SessionComplete({ total, onRestart }: { total: number; onRestart?: () => void }) {
  return (
    <Card className="items-center gap-5 rounded-3xl border px-[20px] py-8 text-center shadow-none ring-0">
      <div className="relative flex size-20 items-center justify-center rounded-3xl border border-blue-100 bg-secondary text-primary">
        <Heart className="size-9" aria-hidden="true" /><Sparkles className="absolute -top-2 -right-2 size-6 text-amber-600" aria-hidden="true" />
      </div>
      <Badge variant="secondary" className="rounded-lg border border-blue-100 px-2 py-1">Một chút mỗi ngày</Badge>
      <h1 tabIndex={-1} className="text-2xl leading-snug font-bold">Bạn đã học hết {total} câu!</h1>
      <p className="text-sm leading-6 text-muted-foreground">Thử nhắn một câu vừa học cho người thương nhé.</p>
      <Button type="button" onClick={onRestart} disabled={!onRestart} className="h-auto min-h-12 w-full rounded-[14px] px-4 py-3 text-base font-bold whitespace-normal"><RotateCcw className="mr-1 size-4" aria-hidden="true" /><span className="min-w-0 break-words">Học lại</span></Button>
    </Card>
  );
}

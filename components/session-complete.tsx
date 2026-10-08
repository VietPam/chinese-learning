"use client";

import { RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SessionComplete({ total, onRestart }: { total: number; onRestart?: () => void }) {
  return (
    <Card className="items-center gap-4 rounded-2xl border p-4 text-center shadow-none ring-0">
      <h1 tabIndex={-1} className="text-2xl leading-snug font-bold">Bạn đã học hết {total} câu!</h1>
      <Button type="button" onClick={onRestart} disabled={!onRestart} className="h-auto min-h-12 w-full rounded-[14px] px-4 py-3 text-base font-bold whitespace-normal"><RotateCcw className="mr-1 size-4" aria-hidden="true" /><span className="min-w-0 break-words">Học lại</span></Button>
    </Card>
  );
}

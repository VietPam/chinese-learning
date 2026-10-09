"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Square, Volume2 } from "lucide-react";
import manifest from "@/lib/audio-manifest.json";
import type { Phrase } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function SentenceAudio({ phrase }: { phrase: Phrase }) {
  const recordings: Record<string, { text: string; src: string }> = manifest;
  const recording = recordings[phrase.id];
  const src = recording?.text === phrase.hanzi ? recording.src : undefined;
  const audio = useRef<HTMLAudioElement>(null);
  const active = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    active.current = true;
    const element = audio.current;
    return () => { active.current = false; element?.pause(); };
  }, []);
  async function toggle() {
    const element = audio.current;
    if (!element || !src) return;
    if (playing || loading) { element.pause(); setLoading(false); return; }
    setFailed(false);
    setLoading(true);
    try {
      if (element.error) element.load();
      element.currentTime = 0;
      await element.play();
    } catch (error) {
      if (active.current && !(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
    } finally { if (active.current) setLoading(false); }
  }
  return <div className="flex shrink-0 flex-col items-center gap-1">
    <Button type="button" variant="outline" size="icon" className="size-[44px] rounded-xl bg-white text-primary" disabled={!src}
      aria-label={!src ? "Audio chưa sẵn sàng" : playing || loading ? "Dừng nghe" : "Nghe câu"} title="Giọng nam · Kokoro" onClick={toggle}>
      {loading ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> : playing ? <Square aria-hidden="true" className="size-4" /> : <Volume2 aria-hidden="true" className="size-5" />}
    </Button>
    <audio ref={audio} src={src} preload="none" onPlaying={() => { setPlaying(true); setLoading(false); }} onPause={() => { setPlaying(false); setLoading(false); }} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setLoading(false); setFailed(true); }} />
    <span role="status" className="max-w-[70px] text-center text-xs text-destructive">{failed ? "Lỗi tải. Thử lại." : ""}</span>
  </div>;
}

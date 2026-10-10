"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Square, Volume2 } from "lucide-react";
import manifest from "@/lib/audio-manifest.json";
import type { Phrase } from "@/lib/types";
import { Button } from "@/components/ui/button";

// One active recording across sentence and vocabulary buttons.
let currentAudio: HTMLAudioElement | null = null;

export function SentenceAudio({ phrase }: { phrase: Phrase }) {
  return <AudioButton audioId={phrase.id} text={phrase.hanzi} label="câu" />;
}

export function WordAudio({ word }: { word: Pick<Phrase["words"][number], "hanzi" | "pinyin"> }) {
  return <AudioButton audioId={`word:${word.hanzi}:${word.pinyin}`} text={word.hanzi} label={`từ ${word.pinyin}`} />;
}

/** A recorded line of the HSK 1 reading explanations. */
export function LineAudio({ audioId, text }: { audioId: string; text: string }) {
  return <AudioButton audioId={audioId} text={text} label={text} />;
}

function AudioButton({ audioId, text, label }: { audioId: string; text: string; label: string }) {
  const recordings: Record<string, { text: string; src: string }> = manifest;
  const recording = recordings[audioId];
  const src = recording?.text === text ? recording.src : undefined;
  const audio = useRef<HTMLAudioElement>(null);
  const active = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    active.current = true;
    const element = audio.current;
    return () => {
      active.current = false;
      element?.pause();
      if (currentAudio === element) currentAudio = null;
    };
  }, []);
  async function toggle() {
    const element = audio.current;
    if (!element || !src) return;
    if (playing || loading) { element.pause(); setLoading(false); return; }
    if (currentAudio && currentAudio !== element) currentAudio.pause();
    currentAudio = element;
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
      aria-label={!src ? "Audio chưa sẵn sàng" : playing || loading ? `Dừng nghe ${label}` : `Nghe ${label}`} title="Giọng nam · Kokoro" onClick={toggle}>
      {loading ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> : playing ? <Square aria-hidden="true" className="size-4" /> : <Volume2 aria-hidden="true" className="size-5" />}
    </Button>
    <audio ref={audio} data-audio-id={audioId} src={src} preload="none" onPlaying={() => { setPlaying(true); setLoading(false); }} onPause={() => { setPlaying(false); setLoading(false); }} onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setLoading(false); setFailed(true); }} />
    <span role="status" className="max-w-[44px] text-center text-xs text-destructive">{failed ? "Lỗi tải. Thử lại." : ""}</span>
  </div>;
}

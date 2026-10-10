import Link from "next/link";

export type LearningMode = "learn" | "quiz" | "typing";
const modes: { id: LearningMode; label: string; color: string }[] = [
  { id: "learn", label: "Học", color: "text-emerald-700 bg-emerald-50" },
  { id: "quiz", label: "Quiz", color: "text-primary bg-blue-50" },
  { id: "typing", label: "Luyện gõ", color: "text-amber-800 bg-amber-50" },
];

/** Original SVG miniatures: pastel fields, soft circles, a single recognizable subject. */
function ModeIcon({ mode }: { mode: LearningMode | "hsk" | "dictionary" }) {
  return <svg viewBox="0 0 48 40" fill="none" aria-hidden="true" className="h-[36px] w-[44px]">
    <circle cx="7" cy="6" r="13" fill="currentColor" opacity=".07" />
    <circle cx="43" cy="36" r="12" fill="currentColor" opacity=".06" />
    <circle cx="24" cy="20" r="15" fill="white" stroke="currentColor" strokeOpacity=".15" />
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {mode === "learn" ? <><path d="M24 14c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V13c-3-1-6-1-9 1v15" /><path d="M18 17h3m-3 4h3m6-4h3m-3 4h3" /></> :
        mode === "quiz" ? <><rect x="16" y="10" width="17" height="21" rx="4" /><path d="m20 19 3 3 6-6m-9 11h8M12 16v15a4 4 0 0 0 4 4" /></> :
          mode === "dictionary" ? <><path d="M15 11h11a3 3 0 0 1 3 3v6M15 11v19h9" /><path d="M19 16h6m-6 4h4" /><circle cx="29" cy="26" r="4" /><path d="m32 29 3 3" /></> :
          mode === "hsk" ? <><path d="M17 9h11l5 5v17a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z" /><path d="M28 9v5h5M19 19h4m-4 4h10m-10 4h10" /><circle cx="28.5" cy="19" r="1.2" /></> :
          <><rect x="12" y="13" width="24" height="16" rx="4" /><path d="M17 18h1m5 0h1m5 0h1m-13 4h1m5 0h1m5 0h1m-10 3h8" /></>}
    </g>
  </svg>;
}
const pages = [
  { href: "/hsk1", icon: "hsk", label: "HSK\u00a01", color: "bg-rose-50 text-rose-700" },
  { href: "/tu-dien", icon: "dictionary", label: "Từ điển", color: "bg-violet-50 text-violet-700" },
] as const;

export function LearningNavigation({ mode, onChange }: { mode: LearningMode; onChange: (mode: LearningMode) => void }) {
  return <nav aria-label="Chế độ học" className="learning-nav fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-white/95 px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-sm">
    {modes.map(item => <button key={item.id} type="button" aria-current={mode === item.id ? "page" : undefined} onClick={() => onChange(item.id)} className={`flex min-h-[64px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-center text-xs font-bold ${mode === item.id ? "bg-secondary text-primary" : "text-muted-foreground"}`}>
      <span className={`overflow-hidden rounded-xl ${item.color}`}><ModeIcon mode={item.id} /></span>
      <span>{item.label}</span>
    </button>)}
    {pages.map(item => <Link key={item.href} href={item.href} className="flex min-h-[64px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-center text-xs font-bold text-muted-foreground">
      <span className={`overflow-hidden rounded-xl ${item.color}`}><ModeIcon mode={item.icon} /></span>
      <span>{item.label}</span>
    </Link>)}
  </nav>;
}

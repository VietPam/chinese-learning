"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import data from "@/lib/dictionary.json";
import { countByLevel, searchDictionary, type DictionaryEntry, type LevelFilter } from "@/lib/dictionary-search";
import { Button } from "@/components/ui/button";
import { WordAudio } from "@/components/sentence-audio";
import { cn } from "@/lib/utils";

const entries = data as DictionaryEntry[];
const counts = countByLevel(entries);
const PAGE = 50;
const levels: { value: LevelFilter; label: string }[] = [
  { value: 0, label: "Tất cả" }, { value: 1, label: "HSK 1" }, { value: 2, label: "HSK 2" }, { value: 3, label: "HSK 3" },
];

function EntryRow({ entry }: { entry: DictionaryEntry }) {
  // The audio button sits in a reserved corner so that, with large text, the details wrap under the hanzi.
  return <li className="relative flex flex-wrap items-start gap-x-3 gap-y-1 rounded-2xl border bg-white p-3 pr-16">
    <p lang="zh-Hans" className="hanzi min-w-[2.5em] shrink-0 text-3xl leading-tight">{entry.hanzi}</p>
    <div className="min-w-[min(9rem,100%)] flex-1 space-y-0.5">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span lang="zh-Latn" className="text-lg font-bold text-primary">{entry.pinyin}</span>
        <span className="rounded-md bg-secondary px-1.5 text-xs font-bold text-primary">HSK {entry.level}</span>
      </p>
      <p className="text-sm text-slate-600">Hán Việt: <span className="font-semibold">{entry.hanViet}</span></p>
      <p className="text-base leading-6 break-words">{entry.meaning}</p>
    </div>
    <div className="absolute top-3 right-3"><WordAudio word={entry} /></div>
  </li>;
}

export function DictionaryScreen() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>(0);
  const [limit, setLimit] = useState(PAGE);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchDictionary(entries, query, level), [query, level]);
  const shown = results.slice(0, limit);
  const remaining = results.length - shown.length;
  const searching = query.trim().length > 0;

  function update(next: { query?: string; level?: LevelFilter }) {
    if (next.query !== undefined) setQuery(next.query);
    if (next.level !== undefined) setLevel(next.level);
    setLimit(PAGE);
  }
  return <>
    <header className="sticky top-0 z-10 border-b bg-white/95 px-3 pt-[env(safe-area-inset-top)] pb-2 backdrop-blur-sm">
      <div className="flex min-h-[52px] items-center gap-2 py-1">
        <Button asChild variant="ghost" size="icon" className="size-[44px] shrink-0 rounded-xl">
          <Link href="/" aria-label="Thoát về trang học"><X className="size-5" aria-hidden="true" /></Link>
        </Button>
        <h1 className="min-w-0 flex-1 text-lg font-bold">Từ điển sơ cấp</h1>
      </div>
      <form role="search" onSubmit={event => { event.preventDefault(); input.current?.blur(); }} className="relative">
        <label htmlFor="dictionary-query" className="sr-only">Tìm từ</label>
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-500" />
        <input ref={input} id="dictionary-query" type="search" inputMode="search" enterKeyHint="search" autoComplete="off" autoCorrect="off" spellCheck={false}
          value={query} onChange={event => update({ query: event.target.value })} placeholder="Chữ Hán, pinyin hoặc tiếng Việt"
          className="h-12 w-full rounded-[14px] border bg-white pr-12 pl-10 text-base outline-none placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 [&::-webkit-search-cancel-button]:hidden" />
        {query && <Button type="button" variant="ghost" size="icon" aria-label="Xóa từ khóa" className="absolute top-0.5 right-0.5 size-11 rounded-xl"
          onClick={() => { update({ query: "" }); input.current?.focus(); }}><X className="size-5" aria-hidden="true" /></Button>}
      </form>
    </header>
    <main className="safe-bottom space-y-3 px-3 pt-3">
      <div role="group" aria-label="Lọc theo cấp HSK" className="grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-2">
        {levels.map(item => <button key={item.value} type="button" aria-pressed={level === item.value} onClick={() => update({ level: item.value })}
          className={cn("flex min-h-12 flex-col items-center justify-center rounded-xl border px-1 py-1 text-sm leading-tight font-semibold", level === item.value ? "border-primary bg-primary text-white" : "bg-white text-foreground")}>
          <span>{item.label}</span>
          <span className={cn("text-xs tabular-nums", level === item.value ? "text-white/90" : "text-slate-600")}>{counts[item.value]} từ</span>
        </button>)}
      </div>
      <p aria-live="polite" className="text-sm text-slate-600">
        {searching ? `${results.length} kết quả cho “${query.trim()}”` : `${results.length} từ`}
      </p>
      {results.length ? <ul className="space-y-2">{shown.map(entry => <EntryRow key={entry.hanzi} entry={entry} />)}</ul> :
        <p className="rounded-2xl border bg-white p-4 text-sm leading-6">Không tìm thấy. Thử gõ không dấu (<span lang="vi">hoc sinh</span>), pinyin (<span lang="zh-Latn">xuesheng</span>) hoặc chữ Hán (<span lang="zh-Hans">学生</span>).</p>}
      {remaining > 0 && <Button type="button" variant="outline" onClick={() => setLimit(limit + PAGE)} className="h-auto min-h-12 w-full rounded-[14px] text-base font-bold">
        Xem thêm {Math.min(PAGE, remaining)} từ
      </Button>}
      <p className="text-xs leading-5 text-slate-600">
        Bản biên soạn: nghĩa và âm Hán Việt có thể còn sai. Danh sách từ HSK 2.0 cấp 1–3 từ <a className="underline" href="https://github.com/drkameleon/complete-hsk-vocabulary">complete-hsk-vocabulary</a> (MIT);
        nghĩa tham khảo <a className="underline" href="https://github.com/ph0ngp/CVDICT">CVDICT</a>. Dữ liệu từ điển phát hành theo <a className="underline" href="https://creativecommons.org/licenses/by-sa/4.0/deed.vi">CC BY-SA 4.0</a>.
      </p>
    </main>
  </>;
}

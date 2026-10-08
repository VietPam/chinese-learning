import type { Phrase } from "@/lib/types";

export function WordMeaningList({ words }: { words: Phrase["words"] }) {
  return <section aria-label="Từ vựng" className="overflow-hidden rounded-2xl border bg-white">
    <table className="w-full table-fixed text-left text-sm leading-6">
      <caption className="sr-only">Từ vựng trong câu</caption>
      <colgroup><col className="w-[32%]" /><col className="w-[20%]" /><col className="w-[48%]" /></colgroup>
      <thead className="bg-muted text-xs text-muted-foreground">
        <tr><th scope="col" className="px-3 py-2 font-semibold">Pinyin</th><th scope="col" className="px-1 py-2 font-semibold">Hán</th><th scope="col" className="px-3 py-2 font-semibold">Nghĩa</th></tr>
      </thead>
      <tbody className="divide-y divide-border/70">
        {words.map((word, index) => <tr key={`${word.hanzi}-${index}`}>
          <th scope="row" lang="zh-Latn" className="break-words px-3 py-2 align-top font-bold text-primary">{word.pinyin}</th>
          <td lang="zh-Hans" className="hanzi break-words px-1 py-2 align-top">{word.hanzi}</td>
          <td className="break-words px-3 py-2 align-top">{word.meaning}</td>
        </tr>)}
      </tbody>
    </table>
  </section>;
}

import type { Metadata } from "next";
import { DictionaryScreen } from "@/components/dictionary/dictionary-screen";

export const metadata: Metadata = {
  title: "Từ điển sơ cấp · Pinyin mỗi ngày",
  description: "601 từ HSK 2.0 cấp 1–3: Pinyin, âm Hán Việt, nghĩa tiếng Việt và audio; tìm bằng chữ Hán, Pinyin hoặc tiếng Việt.",
};

export default function DictionaryPage() {
  return <DictionaryScreen />;
}

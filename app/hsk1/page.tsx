import type { Metadata } from "next";
import { Hsk1Reading } from "@/components/hsk1/hsk1-reading";

export const metadata: Metadata = {
  title: "Đọc HSK 1 · Pinyin mỗi ngày",
  description: "Luyện phần Đọc HSK 1: 20 câu, 4 phần, có Pinyin và giải thích tiếng Việt từng câu.",
};

export default function Hsk1Page() {
  return <Hsk1Reading />;
}

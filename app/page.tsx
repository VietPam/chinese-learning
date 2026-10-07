import { connection } from "next/server";
import { PinyinQuiz } from "@/components/pinyin-quiz";
import { createQuizSession } from "@/lib/quiz";

export default async function Home() {
  // Generate once per request; React serializes the same session for hydration.
  await connection();
  return <PinyinQuiz initialSession={createQuizSession(crypto.randomUUID())} />;
}

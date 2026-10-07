/** Ignore punctuation and whitespace only. Do not silently accept wrong Hanzi or Latin input. */
export function normalizeHanzi(value: string): string {
  return value.normalize("NFC").replace(/[\p{P}\p{White_Space}]/gu, "");
}
export function checkHanzi(input: string, expected: string): boolean {
  const normalized = normalizeHanzi(input);
  return normalized.length > 0 && normalized === normalizeHanzi(expected);
}
export type TypingAttempt = { text: string; result: "correct" | "incorrect" | "empty" | null };

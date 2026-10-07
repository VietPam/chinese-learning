export type Phrase = {
  readonly id: string;
  readonly category: "ask" | "update";
  readonly vietnamese: string;
  readonly pinyin: string;
  readonly keyboardInput: string;
  readonly hanzi: string;
  readonly words: readonly {
    readonly pinyin: string;
    readonly hanzi: string;
    readonly meaning: string;
  }[];
  readonly distractorIds: readonly [string, string];
  readonly note?: string;
};

import { hsk1ProperNouns, hsk1Vocabulary } from "./hsk1-vocabulary.ts";

export const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;
export type Letter = (typeof LETTERS)[number];
export type Judgement = "match" | "mismatch";
export type Hsk1Answer = Judgement | Letter;
export type PartNumber = 1 | 2 | 3 | 4;

export type Hsk1Picture = { readonly emoji: string; readonly label: string };
/** Chinese text split into HSK words by spaces; `__` marks the blank in part 4. */
export type Hsk1Line = { readonly text: string; readonly vi: string; readonly speaker?: "男" | "女" };
export type Hsk1Item = {
  readonly picture?: Hsk1Picture;
  /** Part 1 only: the Chinese word for what the picture actually shows. */
  readonly pictureWord?: string;
  readonly lines: readonly Hsk1Line[];
  readonly answer: Hsk1Answer;
  readonly explanation: string;
};
export type Hsk1Question = Hsk1Item & { readonly id: string; readonly part: PartNumber; readonly number: number };
export type Hsk1Choice = { readonly picture?: Hsk1Picture; readonly line?: Hsk1Line };
export type Hsk1Section = {
  readonly part: PartNumber;
  readonly instruction: string;
  readonly summary: string;
  /** Parts 2–4: choices A–F shared by the example and the five questions. */
  readonly choices: readonly Hsk1Choice[];
  readonly example: Hsk1Item;
  readonly questions: readonly Hsk1Item[];
};

const pic = (emoji: string, label: string): Hsk1Picture => ({ emoji, label });
const line = (text: string, vi: string, speaker?: "男" | "女"): Hsk1Line => speaker ? { text, vi, speaker } : { text, vi };

export const hsk1Sections: readonly Hsk1Section[] = [
  {
    part: 1,
    instruction: "Tranh và từ có khớp nhau không?",
    summary: "Nhìn tranh và một từ, chọn khớp (✓) hoặc không khớp (✗).",
    choices: [],
    example: { picture: pic("✈️", "máy bay"), lines: [line("飞机", "máy bay")], answer: "match", explanation: "Tranh là máy bay; 飞机 fēijī nghĩa là “máy bay” nên khớp." },
    questions: [
      { picture: pic("🍎", "quả táo"), lines: [line("苹果", "quả táo")], answer: "match", explanation: "Tranh là quả táo; 苹果 píngguǒ nghĩa là “quả táo” nên khớp." },
      { picture: pic("🐕", "con chó"), pictureWord: "狗", lines: [line("猫", "con mèo")], answer: "mismatch", explanation: "Tranh là con chó (狗 gǒu), còn 猫 māo là “con mèo” nên không khớp." },
      { picture: pic("📺", "cái tivi"), lines: [line("电视", "tivi")], answer: "match", explanation: "电视 diànshì là “tivi”, đúng với tranh. Đừng nhầm với 电脑 diànnǎo (máy tính) và 电影 diànyǐng (phim)." },
      { picture: pic("🪑", "cái ghế"), pictureWord: "椅子", lines: [line("桌子", "cái bàn")], answer: "mismatch", explanation: "Tranh là cái ghế (椅子 yǐzi); 桌子 zhuōzi là “cái bàn” nên không khớp. Hai từ cùng có 子 nên dễ nhầm." },
      { picture: pic("🏥", "bệnh viện"), lines: [line("医院", "bệnh viện")], answer: "match", explanation: "医院 yīyuàn là “bệnh viện”, khớp với tranh. Còn 医生 yīshēng là “bác sĩ”." },
    ],
  },
  {
    part: 2,
    instruction: "Chọn tranh phù hợp với câu.",
    summary: "Đọc câu, chọn một trong sáu tranh A–F.",
    choices: [
      { picture: pic("🍵", "tách trà") },
      { picture: pic("🌧️", "trời mưa") },
      { picture: pic("📖", "quyển sách đang mở") },
      { picture: pic("🚕", "xe taxi") },
      { picture: pic("🛌", "người đang ngủ trên giường") },
      { picture: pic("📞", "ống nghe điện thoại") },
    ],
    example: { lines: [line("她 在 看 书 。", "Cô ấy đang đọc sách.")], answer: "C", explanation: "看书 kàn shū là “đọc sách”, nên chọn tranh C (quyển sách)." },
    questions: [
      { lines: [line("今天 下雨 了 。", "Hôm nay trời mưa rồi.")], answer: "B", explanation: "下雨 xià yǔ là “mưa”, nên chọn tranh B (trời mưa)." },
      { lines: [line("我 想 喝 茶 。", "Tôi muốn uống trà.")], answer: "A", explanation: "喝 hē là “uống”, 茶 chá là “trà”, nên chọn tranh A (tách trà)." },
      { lines: [line("他 在 睡觉 呢 。", "Anh ấy đang ngủ.")], answer: "E", explanation: "在…呢 diễn tả việc đang diễn ra; 睡觉 shuìjiào là “ngủ”, nên chọn tranh E." },
      { lines: [line("喂 ， 你 在 哪儿 ？", "Alo, bạn đang ở đâu?")], answer: "F", explanation: "喂 wèi là “alo” khi nghe hoặc gọi điện thoại, nên chọn tranh F (điện thoại)." },
      { lines: [line("我们 坐 出租车 去 医院 。", "Chúng tôi đi taxi đến bệnh viện.")], answer: "D", explanation: "坐 zuò + phương tiện là “đi bằng…”; 出租车 chūzūchē là “taxi”, nên chọn tranh D." },
    ],
  },
  {
    part: 3,
    instruction: "Chọn câu trả lời phù hợp.",
    summary: "Đọc câu hỏi, chọn câu đáp trong sáu câu A–F.",
    choices: [
      { line: line("没关系 。", "Không sao.") },
      { line: line("明天 上午 。", "Sáng mai.") },
      { line: line("我 很 好 ， 谢谢 ！", "Tôi rất khỏe, cảm ơn!") },
      { line: line("是 我 同学 的 。", "Là của bạn học tôi.") },
      { line: line("我 叫 王月 。", "Tôi tên là Vương Nguyệt.") },
      { line: line("三 个 ， 爸爸 、 妈妈 和 我 。", "Ba người: bố, mẹ và tôi.") },
    ],
    example: { lines: [line("你 好 吗 ？", "Bạn khỏe không?")], answer: "C", explanation: "Hỏi thăm sức khỏe bằng 你好吗 thì đáp 我很好 (tôi rất khỏe), nên chọn C." },
    questions: [
      { lines: [line("这 是 谁 的 书 ？", "Đây là sách của ai?")], answer: "D", explanation: "谁的 shéi de hỏi “của ai”, nên đáp người sở hữu: 是我同学的 (là của bạn học tôi), chọn D." },
      { lines: [line("你 叫 什么 名字 ？", "Bạn tên là gì?")], answer: "E", explanation: "叫什么名字 hỏi tên, nên đáp 我叫… (tôi tên là…), chọn E." },
      { lines: [line("对不起 ！", "Xin lỗi!")], answer: "A", explanation: "Đáp lại 对不起 duìbuqǐ (xin lỗi) bằng 没关系 méi guānxi (không sao), chọn A." },
      { lines: [line("你 家 有 几 个 人 ？", "Nhà bạn có mấy người?")], answer: "F", explanation: "几个人 hỏi số người, nên đáp “ba người: bố, mẹ và tôi”, chọn F." },
      { lines: [line("你 什么 时候 去 北京 ？", "Khi nào bạn đi Bắc Kinh?")], answer: "B", explanation: "什么时候 shénme shíhou hỏi thời gian, nên đáp 明天上午 (sáng mai), chọn B." },
    ],
  },
  {
    part: 4,
    instruction: "Chọn từ điền vào chỗ trống.",
    summary: "Chọn một trong sáu từ A–F điền vào câu đơn hoặc hội thoại.",
    choices: [
      { line: line("商店", "cửa hàng") },
      { line: line("茶", "trà") },
      { line: line("漂亮", "đẹp") },
      { line: line("岁", "tuổi") },
      { line: line("坐", "ngồi") },
      { line: line("认识", "quen biết") },
    ],
    example: { lines: [line("我 很 喜欢 喝 __ 。", "Tôi rất thích uống trà.")], answer: "B", explanation: "Sau 喝 hē (uống) cần đồ uống: 茶 chá (trà), chọn B." },
    questions: [
      { lines: [line("你 的 衣服 很 __ 。", "Quần áo của bạn rất đẹp.")], answer: "C", explanation: "Sau 很 hěn (rất) thường là tính từ. Trong các từ còn lại, chỉ 漂亮 piàoliang (đẹp) là tính từ, chọn C." },
      { lines: [line("我 想 去 __ 买 东西 。", "Tôi muốn đi cửa hàng mua đồ.")], answer: "A", explanation: "去 + nơi chốn + 买东西 (mua đồ): cần một địa điểm là 商店 shāngdiàn (cửa hàng), chọn A." },
      { lines: [line("请 __ ， 请 喝 茶 。", "Mời ngồi, mời uống trà.")], answer: "E", explanation: "请坐 qǐng zuò là lời mời “mời ngồi” khi có khách, chọn E." },
      { lines: [line("你 女儿 多 大 了 ？", "Con gái chị bao nhiêu tuổi rồi?", "男"), line("她 七 __ 了 。", "Con bé bảy tuổi rồi.", "女")], answer: "D", explanation: "多大了 hỏi tuổi; sau số 七 (bảy) cần 岁 suì (tuổi), chọn D." },
      { lines: [line("你 __ 那 个 人 吗 ？", "Bạn có quen người kia không?", "男"), line("认识 ， 她 是 我 的 汉语 老师 。", "Quen, cô ấy là cô giáo tiếng Trung của tôi.", "女")], answer: "F", explanation: "Người nữ đáp 认识 (quen), nên câu hỏi dùng 认识 rènshi, chọn F." },
    ],
  },
];

export const hsk1Questions: readonly Hsk1Question[] = hsk1Sections.flatMap((section, sectionIndex) =>
  section.questions.map((item, index) => {
    const number = sectionIndex * 5 + index + 1;
    return { ...item, id: `q${String(number).padStart(2, "0")}`, part: section.part, number };
  }));

export const PASS_SCORE = 60;

export type Hsk1Token =
  | { readonly kind: "word"; readonly text: string; readonly pinyin: string; readonly meaning: string }
  | { readonly kind: "punctuation"; readonly text: string }
  | { readonly kind: "blank" };

export function lookupWord(text: string) {
  return hsk1Vocabulary[text] ?? hsk1ProperNouns[text];
}
/** Throws on words outside HSK 1, so content tests catch them before release. */
export function tokenize(text: string): Hsk1Token[] {
  return text.split(" ").map(part => {
    if (part === "__") return { kind: "blank" };
    if (/^\p{P}+$/u.test(part)) return { kind: "punctuation", text: part };
    const word = lookupWord(part);
    if (!word) throw new Error(`Từ ngoài HSK 1: ${part}`);
    return { kind: "word", text: part, ...word };
  });
}

/** Unsegmented Chinese as printed on paper, e.g. for docs and screen-reader labels. */
export function plainText(line: Hsk1Line) {
  return (line.speaker ? `${line.speaker}：` : "") + line.text.split(" ").map(part => part === "__" ? "（　）" : part).join("");
}
export function answerLabel(answer: Hsk1Answer) {
  return answer === "match" ? "✓" : answer === "mismatch" ? "✗" : answer;
}

export function sectionOf(part: PartNumber): Hsk1Section {
  return hsk1Sections[part - 1];
}
export function letterIndex(letter: Letter) {
  return LETTERS.indexOf(letter);
}

/** What a learner hears: no speaker label, the blank already filled. */
export function spokenText(line: Hsk1Line, fill?: string) {
  return line.text.split(" ").map(part => part === "__" ? fill ?? "" : part).join("");
}
export type ExplanationRow = { readonly label?: string; readonly line: Hsk1Line; readonly fill?: string };
/** Chinese lines shown, with audio and word lookup, after a question is answered. */
export function explanationRows(question: Hsk1Question): ExplanationRow[] {
  if (question.part === 4) {
    const fill = sectionOf(4).choices[letterIndex(question.answer as Letter)].line!.text;
    return question.lines.map(line => ({ line, fill }));
  }
  const label = question.part === 1 ? "Từ" : question.part === 3 ? "Câu hỏi" : undefined;
  return [
    ...question.lines.map(line => label ? { label, line } : { line }),
    ...question.pictureWord ? [{ label: "Tranh", line: { text: question.pictureWord, vi: question.picture!.label } }] : [],
    ...question.part === 3 ? [{ label: `Đáp án ${question.answer}`, line: sectionOf(3).choices[letterIndex(question.answer as Letter)].line! }] : [],
  ];
}
export const lineAudioId = (row: ExplanationRow) => `hsk1:${spokenText(row.line, row.fill)}`;
/** Recordings the explanation screens need; read by scripts/generate-audio.py. */
export function hsk1AudioItems() {
  const sentences = new Map<string, string>();
  const words = new Map<string, { hanzi: string; pinyin: string }>();
  for (const row of hsk1Questions.flatMap(explanationRows)) {
    sentences.set(lineAudioId(row), spokenText(row.line, row.fill));
    for (const token of [...tokenize(row.line.text), ...row.fill ? tokenize(row.fill) : []]) {
      if (token.kind === "word") words.set(`word:${token.text}:${token.pinyin}`, { hanzi: token.text, pinyin: token.pinyin });
    }
  }
  return {
    sentences: [...sentences].map(([id, text]) => ({ id, text })),
    words: [...words.values()],
  };
}
/** Choice letters a question may use: the example's choice is already taken. */
export function availableAnswers(question: Pick<Hsk1Question, "part">): readonly Hsk1Answer[] {
  if (question.part === 1) return ["match", "mismatch"];
  const section = sectionOf(question.part);
  return LETTERS.slice(0, section.choices.length).filter(letter => letter !== section.example.answer);
}

export type Hsk1State = {
  readonly stage: "intro" | "question" | "result";
  readonly index: number;
  readonly answers: Readonly<Record<string, Hsk1Answer>>;
};
export type Hsk1Action =
  | { type: "START" | "MISSING" | "FINISH" | "RESTART" }
  | { type: "GO"; index: number }
  | { type: "ANSWER"; questionId: string; answer: Hsk1Answer };

export const initialHsk1State: Hsk1State = { stage: "intro", index: 0, answers: {} };

export function hsk1Reducer(state: Hsk1State, action: Hsk1Action): Hsk1State {
  const total = hsk1Questions.length;
  switch (action.type) {
    case "START": return state.stage === "intro" ? { ...state, stage: "question", index: 0 } : state;
    case "RESTART": return { stage: "question", index: 0, answers: {} };
    case "GO":
      if (state.stage === "intro" || !Number.isInteger(action.index) || action.index < 0 || action.index >= total) return state;
      return state.stage === "question" && action.index === state.index ? state : { ...state, stage: "question", index: action.index };
    case "MISSING": {
      const index = hsk1Questions.findIndex(q => !state.answers[q.id]);
      return state.stage !== "question" || index < 0 ? state : { ...state, index };
    }
    case "FINISH":
      return state.stage === "question" && Object.keys(state.answers).length === total ? { ...state, stage: "result" } : state;
    case "ANSWER": {
      const question = hsk1Questions[state.index];
      // Ignore stale taps from a previous screen and keep the first answer.
      if (state.stage !== "question" || question.id !== action.questionId || state.answers[question.id]) return state;
      if (!availableAnswers(question).includes(action.answer)) return state;
      return { ...state, answers: { ...state.answers, [question.id]: action.answer } };
    }
  }
}

export function scoreHsk1(answers: Readonly<Record<string, Hsk1Answer>>) {
  const correctIds = new Set(hsk1Questions.filter(q => answers[q.id] === q.answer).map(q => q.id));
  const total = hsk1Questions.length;
  const score = Math.round(correctIds.size * 100 / total);
  return {
    correct: correctIds.size, total, score, passed: score >= PASS_SCORE,
    byPart: hsk1Sections.map(section => {
      const questions = hsk1Questions.filter(q => q.part === section.part);
      return { part: section.part, correct: questions.filter(q => correctIds.has(q.id)).length, total: questions.length };
    }),
    wrong: hsk1Questions.filter(q => !correctIds.has(q.id)),
  };
}

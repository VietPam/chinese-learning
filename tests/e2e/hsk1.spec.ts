import { test, expect, type ElementHandle, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { availableAnswers, hsk1Questions, sectionOf, scoreHsk1, type Hsk1Answer } from "../../lib/hsk1-reading";

async function audit(page: Page) {
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
}
const choice = (page: Page, answer: Hsk1Answer) => page.getByRole("group").getByRole("button", {
  name: answer === "match" ? /^Khớp/ : answer === "mismatch" ? /^Không khớp/ : new RegExp(`^${answer}\\.`),
});
const continueButton = (page: Page) => page.getByTestId("answer-feedback").getByRole("button", { name: "Câu tiếp theo" });
const wrongAnswer = (index: number) => availableAnswers(hsk1Questions[index]).find(a => a !== hsk1Questions[index].answer)!;

test("HSK 1 reading: start from home, answer with instant feedback, look up words, score, review and restart", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("navigation", { name: "Chế độ học" }).getByRole("link", { name: "HSK 1" }).tap();
  await expect(page).toHaveURL(/\/hsk1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Đề Đọc HSK 1 – Đề 1");
  await audit(page);
  await page.screenshot({ path: info.outputPath("hsk1-intro.png"), fullPage: true });
  await page.getByRole("button", { name: "Bắt đầu làm bài" }).tap();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();

  const chosen: Record<string, Hsk1Answer> = {};
  let playing: ElementHandle<HTMLElement | SVGElement> | null = null;
  for (let i = 0; i < hsk1Questions.length; i++) {
    const question = hsk1Questions[i];
    await expect(page.getByRole("banner")).toContainText(`Câu ${i + 1}/20`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(sectionOf(question.part).instruction);
    if (question.part > 1) await expect(page.getByRole("group").getByRole("button", { name: /Đã dùng ở ví dụ$/ })).toBeDisabled();
    if (i === 2) {
      // Skip one question; it must be answered before the result opens.
      await page.getByRole("button", { name: "Câu tiếp theo", exact: true }).tap();
      continue;
    }
    const answer = i % 4 === 1 ? wrongAnswer(i) : question.answer;
    chosen[question.id] = answer;
    await choice(page, answer).tap();
    await expect(page.getByRole("status").filter({ hasText: /Đúng rồi|Chưa đúng/ })).toContainText(answer === question.answer ? "Đúng rồi" : "Chưa đúng");
    await expect(page.getByRole("group").getByRole("button", { disabled: false })).toHaveCount(0);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(Object.keys(chosen).length * 5));
    if ([0, 5, 10, 15].includes(i)) {
      await audit(page);
      await page.screenshot({ path: info.outputPath(`hsk1-part${question.part}.png`), fullPage: true });
    }
    if (i === 15) {
      // The blank is filled with the answer and words can be looked up.
      const feedback = page.getByTestId("answer-feedback");
      await expect(feedback).toContainText("（漂亮piàoliang）");
      const lookup = feedback.getByTestId("word-lookup");
      await feedback.getByRole("button", { name: "Tra từ 衣服" }).tap();
      await expect(lookup).toContainText("yīfu");
      await expect(lookup).toContainText("quần áo");
      // Recordings play on demand only, one at a time: the filled sentence, then the looked-up word.
      const sentence = feedback.locator('audio[data-audio-id="hsk1:你的衣服很漂亮。"]');
      const word = feedback.locator('audio[data-audio-id="word:衣服:yīfu"]');
      expect(await sentence.evaluate(el => (el as HTMLAudioElement).readyState)).toBe(0);
      await feedback.getByRole("button", { name: "Nghe 你的衣服很漂亮。" }).tap();
      await expect.poll(() => sentence.evaluate(el => (el as HTMLAudioElement).currentTime)).toBeGreaterThan(0);
      await feedback.getByRole("button", { name: "Nghe từ yīfu" }).tap();
      await expect.poll(() => word.evaluate(el => (el as HTMLAudioElement).currentTime)).toBeGreaterThan(0);
      expect(await sentence.evaluate(el => (el as HTMLAudioElement).paused)).toBe(true);
      await feedback.getByRole("button", { name: "Tra từ 衣服" }).tap();
      await expect(lookup).toBeEmpty();
      await expect(word).toHaveCount(0);
      await feedback.getByRole("button", { name: "Nghe 你的衣服很漂亮。" }).tap();
      await expect.poll(() => sentence.evaluate(el => (el as HTMLAudioElement).currentTime)).toBeGreaterThan(0);
      playing = await sentence.elementHandle();
    }
    if (i < hsk1Questions.length - 1) {
      await continueButton(page).tap();
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    }
    if (playing) {
      // Leaving the question stops its recording.
      expect(await playing.evaluate(el => (el as HTMLAudioElement).paused)).toBe(true);
      playing = null;
    }
  }
  await expect(page.getByText("Còn 1 câu chưa làm.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Xem kết quả" })).toHaveCount(0);
  await page.getByRole("button", { name: "Làm câu còn thiếu" }).tap();
  await expect(page.getByRole("banner")).toContainText("Câu 3/20");
  chosen.q03 = hsk1Questions[2].answer;
  await choice(page, chosen.q03).tap();
  await page.getByRole("button", { name: "Xem kết quả" }).tap();

  const result = scoreHsk1(chosen);
  expect([result.score, result.passed]).toEqual([75, true]);
  await expect(page.getByRole("heading", { name: "Kết quả bài đọc" })).toBeFocused();
  await expect(page.getByText(`${result.score}/100`)).toBeVisible();
  await expect(page.getByText(`Đúng ${result.correct}/20 câu`)).toBeVisible();
  await expect(page.getByText("Đạt mốc tham khảo 60/100")).toBeVisible();
  for (const part of result.byPart) await expect(page.getByRole("row", { name: new RegExp(`^Phần ${part.part}`) })).toContainText(`${part.correct}/5`);
  await audit(page);
  await page.screenshot({ path: info.outputPath("hsk1-result.png"), fullPage: true });
  await expect(page.getByRole("button", { name: /^Câu \d+$/ })).toHaveCount(result.wrong.length);
  await page.getByRole("button", { name: "Câu 6", exact: true }).tap();
  await expect(page.getByRole("banner")).toContainText("Câu 6/20");
  await expect(page.getByTestId("answer-feedback")).toContainText("Chưa đúng");
  await page.getByRole("button", { name: "Xem kết quả" }).tap();
  await page.getByRole("button", { name: "Làm lại từ đầu" }).tap();
  await expect(page.getByRole("banner")).toContainText("Câu 1/20");
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByTestId("answer-feedback")).toHaveCount(0);
  await page.getByRole("link", { name: "Thoát về trang học" }).tap();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("banner")).toContainText("Câu 1/");
  expect(errors).toEqual([]);
});

test("HSK 1 examples, 200% text and reload stay usable", async ({ page }, info) => {
  await page.goto("/hsk1", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Bắt đầu làm bài" }).tap();
  await choice(page, hsk1Questions[0].answer).tap();
  await page.getByRole("button", { name: "Câu tiếp theo", exact: true }).first().tap();
  for (let i = 1; i < 15; i++) await page.getByRole("banner").getByRole("button", { name: "Câu tiếp theo" }).tap();
  await expect(page.getByRole("banner")).toContainText("Câu 16/20");
  await page.getByText("Xem ví dụ").tap();
  await expect(page.locator("details")).toContainText("Đáp án: B");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await audit(page);
  const overflowing = await page.getByRole("group").getByRole("button").evaluateAll(buttons => buttons.filter(b => b.scrollWidth > b.clientWidth + 1).length);
  expect(overflowing).toBe(0);
  await page.screenshot({ path: info.outputPath("hsk1-large.png"), fullPage: true });
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Đề Đọc HSK 1 – Đề 1");
});

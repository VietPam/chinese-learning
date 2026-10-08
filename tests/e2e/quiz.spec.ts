import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { phrases } from "../../lib/content";

async function audit(page: Page) {
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
}
async function currentPhrase(page: Page) {
  const text = await page.getByRole("heading", { level: 1 }).innerText();
  return phrases.find(p => p.vietnamese === text)!;
}
const next = (page: Page) => page.getByRole("button", { name: "Câu tiếp theo", exact: true });
const previous = (page: Page) => page.getByRole("button", { name: "Câu trước", exact: true });
const mode = (page: Page, name: string) => page.getByRole("navigation", { name: "Chế độ học" }).getByRole("button", { name, exact: true });

test("shuffled quiz supports skipping, retained answers, missing review, completion and restart", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/", { waitUntil: "networkidle" });
  const seen = new Set<string>();
  let skipped = "";
  for (let i = 0; i < 20; i++) {
    const phrase = await currentPhrase(page);
    expect(phrase).toBeTruthy();
    expect(seen.has(phrase.id)).toBe(false);
    seen.add(phrase.id);
    await expect(page.getByRole("banner")).toContainText(`Câu ${i + 1}/20`);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(Math.max(0, i - 1) * 5));
    if (i === 0) {
      skipped = phrase.id;
      await expect(previous(page)).toBeDisabled();
      await audit(page);
      await page.screenshot({ path: info.outputPath("quiz.png"), fullPage: true });
    } else {
      const choices = page.getByRole("group").getByRole("button");
      await choices.filter({ hasText: i % 2 ? phrases.find(p => p.id === phrase.distractorIds[0])!.pinyin : phrase.pinyin }).tap();
      await expect(page.getByRole("status")).toContainText(i % 2 ? "Chưa đúng" : "Đúng rồi");
      await expect(page.getByRole("group").getByRole("button", { disabled: true })).toHaveCount(3);
      if (i === 1) {
        const order = await choices.allTextContents();
        await previous(page).tap();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(phrases.find(p => p.id === skipped)!.vietnamese);
        await expect(page.getByTestId("answer-feedback")).toHaveCount(0);
        await next(page).tap();
        expect(await choices.allTextContents()).toEqual(order);
        await expect(page.getByTestId("answer-feedback")).toBeVisible();
        await audit(page);
      }
    }
    if (i < 19) {
      await next(page).tap();
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    }
  }
  expect(seen.size).toBe(20);
  await expect(next(page)).toBeDisabled();
  await expect(page.getByText("Còn 1 câu chưa trả lời.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hoàn thành", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Làm câu còn thiếu" }).tap();
  await expect(page.getByRole("banner")).toContainText("Câu 1/20");
  await page.getByRole("group").getByRole("button").first().tap();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  await page.getByRole("button", { name: "Hoàn thành", exact: true }).tap();
  await expect(page.getByRole("heading", { name: "Bạn đã học hết 20 câu!" })).toBeFocused();
  await audit(page);
  await expect(page.getByRole("banner")).toContainText("Câu 20/20");
  await page.getByRole("button", { name: "Học lại", exact: true }).tap();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByRole("banner")).toContainText("Câu 1/20");
  expect(errors).toEqual([]);
});

test("study and typing keep independent positions, drafts and results; Enter respects composition", async ({ page }, info) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const quizPhrase = await currentPhrase(page);
  await page.getByRole("group").getByRole("button").first().tap();
  await mode(page, "Học").tap();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(phrases[0].vietnamese);
  await expect(page.locator('p[lang="zh-Hans"]')).toHaveText(phrases[0].hanzi);
  await audit(page);
  await page.screenshot({ path: info.outputPath("learn.png"), fullPage: true });
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width, height: 640 });
  const table = await page.getByRole("table").boundingBox();
  const bottomBar = await page.getByRole("navigation", { name: "Chế độ học" }).boundingBox();
  expect(table!.y + table!.height).toBeLessThanOrEqual(bottomBar!.y);
  await page.screenshot({ path: info.outputPath("learn-short-viewport.png"), fullPage: true });
  await page.setViewportSize(viewport);
  await next(page).tap();
  await mode(page, "Luyện gõ").tap();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(phrases[0].vietnamese);
  await expect(page.locator('p[lang="zh-Hans"]')).toHaveCount(0);
  const input = page.getByRole("textbox", { name: "Nhập chữ Hán" });
  await input.fill("ni");
  await input.dispatchEvent("compositionstart");
  await input.press("Enter");
  await expect(page.getByRole("status")).toBeEmpty();
  await input.dispatchEvent("compositionend");
  // Safari may deliver compositionend just before the same confirming Enter.
  await input.evaluate(el => {
    el.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    el.closest("form")!.requestSubmit();
  });
  await expect(page.getByRole("status")).toBeEmpty();
  await page.waitForTimeout(120);
  await input.fill("你好");
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("Chưa đúng");
  await expect(input).toHaveValue("你好");
  await expect(page.getByRole("status")).toContainText(phrases[0].hanzi);
  await input.fill(phrases[0].hanzi.replace(/[\p{P}]/gu, "") + " ！");
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("Đúng rồi");
  await expect(page.getByRole("banner")).toContainText("Câu 1/20");
  await audit(page);
  await page.screenshot({ path: info.outputPath("typing.png"), fullPage: true });
  await next(page).tap();
  await input.fill("草稿");
  await input.blur();
  await mode(page, "Học").tap();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(phrases[1].vietnamese);
  await mode(page, "Quiz").tap();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(quizPhrase.vietnamese);
  await expect(page.getByTestId("answer-feedback")).toBeVisible();
  await mode(page, "Luyện gõ").tap();
  await expect(input).toHaveValue("草稿");
  await previous(page).tap();
  await expect(page.getByRole("status")).toContainText("Đúng rồi");
  await input.fill(" 。 ");
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("Nhập chữ Hán trước");
  await input.blur();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  await mode(page, "Luyện gõ").tap();
  await expect(input).toHaveValue("");
});

test("200% text, long study/typing sentences, keyboard and bottom navigation remain usable", async ({ page }, info) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await expect(next(page)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("group").getByRole("button").first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("answer-feedback")).toBeVisible();
  await mode(page, "Học").tap();
  for (let i = 0; i < 10; i++) await next(page).tap();
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await audit(page);
  await page.screenshot({ path: info.outputPath("learn-large.png"), fullPage: true });
  await mode(page, "Luyện gõ").tap();
  for (let i = 0; i < 10; i++) await next(page).tap();
  const input = page.getByRole("textbox");
  await input.fill(phrases[10].hanzi);
  await expect(page.getByRole("navigation", { name: "Chế độ học" })).toBeHidden();
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("Đúng rồi");
  await expect(mode(page, "Luyện gõ")).toBeVisible();
  await audit(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: info.outputPath("typing-large.png"), fullPage: true });
});

test("production hides design fixtures", async ({ request }) => {
  expect((await request.get("/design-preview")).status()).toBe(404);
});

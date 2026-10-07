import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { phrases } from "../../lib/content";

async function audit(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
}

test("complete a mixed-result session, restart and reload", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const requests: string[] = [];
  page.on("request", r => { if (["fetch", "xhr", "document"].includes(r.resourceType())) requests.push(r.url()); });

  for (const [i, phrase] of phrases.entries()) {
    await expect(page.getByRole("heading", { name: phrase.vietnamese, exact: true })).toBeVisible();
    await expect(page.getByTestId("answer-feedback")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Câu tiếp theo|Hoàn thành/ })).toHaveCount(0);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(i * 5));
    const choices = page.getByRole("group").getByRole("button");
    await expect(choices).toHaveCount(3);
    if (i === 0) {
      await audit(page);
      for (const choice of await choices.all()) {
        const box = (await choice.boundingBox())!;
        expect(box.height).toBeGreaterThanOrEqual(56);
        expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height);
      }
      await page.screenshot({ path: testInfo.outputPath("question.png"), fullPage: true });
    }
    const pinyinOrder = await choices.locator('[lang="zh-Latn"]').allTextContents();
    const selected = i % 2 ? phrases.find(p => p.id === phrase.distractorIds[0])! : phrase;
    const target = choices.filter({ hasText: selected.pinyin });
    await target.tap();
    await expect(page.getByTestId("answer-feedback")).toBeVisible();
    await expect(page.getByRole("status")).toContainText(i % 2 ? "Chưa đúng" : "Đúng rồi");
    await expect(page.getByRole("group").getByRole("button", { disabled: true })).toHaveCount(3);
    await target.evaluate(el => { (el as HTMLButtonElement).click(); (el as HTMLButtonElement).click(); });
    expect(await choices.locator('[lang="zh-Latn"]').allTextContents()).toEqual(pinyinOrder);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String((i + 1) * 5));
    await expect(page.getByTestId("answer-feedback").locator('p[lang="zh-Hans"]')).toHaveText(phrase.hanzi);
    await noOverflow(page);
    if ([0, 1, 10, 12].includes(i)) {
      await audit(page);
      await page.screenshot({ path: testInfo.outputPath(`feedback-${i + 1}.png`), fullPage: true });
    }
    const next = page.getByRole("button", { name: i === 19 ? "Hoàn thành" : "Câu tiếp theo", exact: true });
    expect((await next.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    await next.scrollIntoViewIfNeeded();
    if (i === 10) await next.evaluate(el => { (el as HTMLButtonElement).click(); (el as HTMLButtonElement).click(); });
    else await next.tap();
    await expect(page.getByRole("heading", { name: i === 19 ? "Bạn đã học hết 20 câu!" : phrases[i + 1].vietnamese, exact: true })).toBeFocused();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  }
  await audit(page);
  await page.screenshot({ path: testInfo.outputPath("complete.png"), fullPage: true });
  await page.getByRole("button", { name: "Học lại", exact: true }).tap();
  await expect(page.getByRole("heading", { name: phrases[0].vietnamese, exact: true })).toBeFocused();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByTestId("answer-feedback")).toHaveCount(0);
  expect(requests).toEqual([]);
  await page.getByRole("group").getByRole("button").first().tap();
  await page.getByRole("button", { name: "Câu tiếp theo", exact: true }).tap();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: phrases[0].vietnamese, exact: true })).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  expect(errors).toEqual([]);
});

test("keyboard access and 200% text with long explanations", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  await expect(page.getByRole("group").getByRole("button").first()).toBeFocused();
  expect(await page.locator(":focus").evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("answer-feedback")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Câu tiếp theo", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: phrases[1].vietnamese, exact: true })).toBeFocused();
  for (let i = 1; i < 10; i++) {
    await page.getByRole("group").getByRole("button").first().tap();
    await page.getByRole("button", { name: "Câu tiếp theo", exact: true }).tap();
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.getByRole("group").getByRole("button").first().tap();
  await noOverflow(page);
  await audit(page);
  const nextButton = page.getByRole("button", { name: "Câu tiếp theo", exact: true });
  expect(await nextButton.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("large-text.png"), fullPage: true });
  await page.getByRole("button", { name: "Câu tiếp theo", exact: true }).tap();
  await expect(page.getByRole("heading", { name: phrases[11].vietnamese, exact: true })).toBeFocused();
  await noOverflow(page);
});

test("production hides design fixtures", async ({ request }) => {
  expect((await request.get("/design-preview")).status()).toBe(404);
});

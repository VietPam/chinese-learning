import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function audit(page: Page) {
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
}
const rows = (page: Page) => page.getByRole("main").getByRole("listitem");
const search = (page: Page) => page.getByRole("searchbox", { name: "Tìm từ" });
const count = (page: Page) => page.getByRole("main").locator("p[aria-live]");

test("dictionary: open from home, search by hanzi, pinyin, Hán Việt and Vietnamese, filter, page and play audio", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("navigation", { name: "Chế độ học" }).getByRole("link", { name: "Từ điển" }).tap();
  await expect(page).toHaveURL(/\/tu-dien$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Từ điển sơ cấp");
  await expect(count(page)).toHaveText("601 từ");
  await expect(rows(page)).toHaveCount(50);
  await audit(page);
  await page.screenshot({ path: info.outputPath("dictionary.png"), fullPage: false });
  await page.getByRole("button", { name: "Xem thêm 50 từ" }).tap();
  await expect(rows(page)).toHaveCount(100);

  for (const [query, hanzi] of [["学生", "学生"], ["xuesheng", "学生"], ["xué shēng", "学生"], ["hoc sinh", "学生"], ["ăn", "吃"], ["lv", "绿"], ["Bắc Kinh", "北京"]]) {
    await search(page).fill(query);
    await expect(rows(page).first().locator('[lang="zh-Hans"]').first()).toHaveText(hanzi);
  }
  await search(page).fill("hoc sinh");
  await expect(count(page)).toContainText("kết quả cho “hoc sinh”");
  await page.screenshot({ path: info.outputPath("dictionary-search.png"), fullPage: false });
  await search(page).fill("qwerty");
  await expect(rows(page)).toHaveCount(0);
  await expect(page.getByText("Không tìm thấy.")).toBeVisible();
  await page.getByRole("button", { name: "Xóa từ khóa" }).tap();
  await expect(search(page)).toBeFocused();
  await expect(search(page)).toHaveValue("");
  await expect(count(page)).toHaveText("601 từ");

  await page.getByRole("group", { name: "Lọc theo cấp HSK" }).getByRole("button", { name: /^HSK 2/ }).tap();
  await expect(page.getByRole("button", { name: /^HSK 2/ })).toHaveAttribute("aria-pressed", "true");
  await expect(count(page)).toHaveText("147 từ");
  for (const badge of await rows(page).getByText(/^HSK \d$/).allTextContents()) expect(badge).toBe("HSK 2");
  await search(page).fill("xuesheng");
  await expect(rows(page)).toHaveCount(0);
  await page.getByRole("button", { name: /^Tất cả/ }).tap();
  await expect(rows(page)).toHaveCount(1);

  // Recordings play on demand, one at a time.
  const word = rows(page).first().locator("audio");
  expect(await word.evaluate(el => (el as HTMLAudioElement).readyState)).toBe(0);
  await rows(page).first().getByRole("button", { name: "Nghe từ xuésheng" }).tap();
  await expect.poll(() => word.evaluate(el => (el as HTMLAudioElement).currentTime)).toBeGreaterThan(0);
  await search(page).fill("chang");
  const long = rows(page).filter({ hasText: "dài" }).first();
  await long.getByRole("button", { name: "Nghe từ cháng" }).tap();
  await expect.poll(() => long.locator("audio").evaluate(el => (el as HTMLAudioElement).currentTime)).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("dictionary stays usable with 200% text and every entry has a recording", async ({ page }, info) => {
  await page.goto("/tu-dien", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Audio chưa sẵn sàng" })).toHaveCount(0);
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await audit(page);
  const overflowing = await rows(page).evaluateAll(items => items.filter(item => item.scrollWidth > item.clientWidth + 1).length);
  expect(overflowing).toBe(0);
  await page.screenshot({ path: info.outputPath("dictionary-large.png"), fullPage: false });
  const more = page.getByRole("button", { name: /^Xem thêm/ });
  for (let shown = 50; shown < 601; shown += 50) {
    await expect(rows(page)).toHaveCount(shown);
    await more.tap();
  }
  await expect(rows(page)).toHaveCount(601);
  await expect(page.getByRole("button", { name: "Audio chưa sẵn sàng" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Xem thêm/ })).toHaveCount(0);
});

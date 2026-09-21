import { expect, test, type Page } from "@playwright/test";
import { seed, seededStore, isoDaysAgo, greetingFor } from "./helpers";

const androidBack = (page: Page) =>
  page.evaluate(() => window.dispatchEvent(new Event("dosekey:back")));

test.beforeEach(async ({ page }) => {
  const data = seededStore();
  data.periods.unshift({
    ...data.periods[0], id: 99, dose: "10 mg", start: isoDaysAgo(14), active: false,
  });
  await seed(page, data);
  await page.goto("/");
});

test("plan dönemleri ve bugün istatistikleri doğru seçili dönemle açılır", async ({ page }) => {
  await page.getByRole("button", { name: "Plan", exact: true }).click();
  await page.locator(".period-item").filter({ hasText: "12,5 mg" }).click();
  await expect(page.getByRole("combobox", { name: "Doz dönemi" })).toContainText("12,5 mg / 0,5 ml · Aktif dönem");
  await androidBack(page);
  await expect(page.getByRole("heading", { name: "Plan", exact: true })).toBeVisible();
  await page.locator(".period-item").filter({ hasText: "10 mg" }).click();
  await expect(page.getByRole("combobox", { name: "Doz dönemi" })).toContainText("10 mg / 0,5 ml");
  await page.getByRole("button", { name: "Bugün", exact: true }).click();
  await page.getByRole("button", { name: "İlerlemeyi aç", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Doz dönemi" })).toContainText("Aktif dönem");
});

test("Android geri önce seçimi ve paneli kapatır sonra önceki sayfaya döner", async ({ page }) => {
  await page.getByRole("button", { name: "Plan", exact: true }).click();
  await page.locator(".period-item").filter({ hasText: "12,5 mg" }).click();
  await page.getByRole("combobox", { name: "Doz dönemi" }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await androidBack(page);
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "İlerleme", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "İştah kayıtlarını gör" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await androidBack(page);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "İlerleme", exact: true })).toBeVisible();
  await androidBack(page);
  await expect(page.getByRole("heading", { name: "Plan", exact: true })).toBeVisible();
  await androidBack(page);
  await expect(page.getByText(greetingFor("Test Kullanıcısı"))).toBeVisible();
  await androidBack(page);
  await expect(page.getByText(greetingFor("Test Kullanıcısı"))).toBeVisible();
});

test("Belirtiler paneli büyür küçülür ve girilen değerleri korur", async ({ page }) => {
  await page.getByRole("button", { name: "Belirtiler", exact: true }).click();
  const panel = page.getByRole("dialog");
  await expect(panel.getByRole("heading", { name: "Belirtiler", exact: true })).toBeVisible();
  const initial = (await panel.boundingBox())!.height;
  await page.getByRole("button", { name: "Paneli büyüt" }).click();
  await expect.poll(async () => (await panel.boundingBox())!.height).toBeGreaterThan(initial + 100);
  const appetite = page.getByRole("group", { name: "Bugün iştahın nasıldı?" });
  await appetite.getByRole("button", { name: "4", exact: true }).click();
  await page.locator(".weight-input input").fill("90.5");
  await page.getByRole("button", { name: "Paneli küçült" }).click();
  await expect.poll(async () => (await panel.boundingBox())!.height).toBeLessThan(initial + 5);
  await page.getByRole("button", { name: "Paneli büyüt" }).click();
  await expect(page.locator(".weight-input input")).toHaveValue("90.5");
  await expect(appetite.getByRole("button", { name: "4", exact: true })).toHaveClass("active");
  await expect(page.getByRole("button", { name: "Kaydı tamamla" })).toBeInViewport();
  await androidBack(page);
  await expect(panel).toHaveCount(0);
});

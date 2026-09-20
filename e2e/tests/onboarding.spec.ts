import { expect, test } from "@playwright/test";
import { clearDoseKey, greetingFor } from "./helpers";

test("yeni kullanıcı planını oluşturabilir", async ({ page }) => {
  await clearDoseKey(page);
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "DoseKey’e hoş geldin" })).toBeVisible();
  await page.getByLabel("İsim").fill("Batuhan Test");

  await page.getByLabel("Cinsiyet").click();
  await page.getByRole("option", { name: "Belirtmek istemiyorum" }).click();
  await page.getByLabel("Doğum tarihi").fill("1995-05-15");
  await page.getByRole("button", { name: "Devam" }).click();

  await page.getByRole("button", { name: /Mounjaro/ }).click();
  await page.getByRole("button", { name: "Devam" }).click();

  await page.getByLabel("Kullanılan doz").click();
  await page.getByRole("option", { name: "12,5 mg / 0,5 ml" }).click();
  await page.getByRole("button", { name: "Devam" }).click();

  await page.getByRole("button", { name: "Her 7 günde bir" }).click();
  await page.getByRole("button", { name: "Devam" }).click();
  await expect(page.getByRole("heading", { name: "İlk kullanım günün ne zaman?" })).toBeVisible();
  await page.getByRole("button", { name: "Devam" }).click();

  await expect(page.getByRole("heading", { name: "Hatırlatma ister misin?" })).toBeVisible();
  await page.getByRole("button", { name: "Planımı oluştur" }).click();

  await expect(page.getByText(greetingFor("Batuhan Test"))).toBeVisible();
  await expect(page.getByText("Mounjaro", { exact: true })).toBeVisible();
  await expect(page.getByText("12,5 mg / 0,5 ml", { exact: true })).toBeVisible();
});

import { expect, test } from "@playwright/test";
import { greetingFor, isoDaysAgo, seed, seededStore, today } from "./helpers";

test.beforeEach(async ({ page }) => {
  await seed(page);
  await page.goto("/");
});

test("ana ekran ve alt menü açılır", async ({ page }) => {
  await expect(page.getByText(greetingFor("Test Kullanıcısı"))).toBeVisible();
  await expect(page.getByText("Sonraki dozuna 0 gün var").or(page.getByText("Bugün doz günün"))).toBeVisible();

  for (const item of ["Geçmiş", "İlerleme", "Plan", "Bugün"]) {
    await page.getByRole("button", { name: item, exact: true }).click();
  }
});

test("doz kaydı eklenir, detayı açılır ve silinir", async ({ page }) => {
  await page.getByRole("button", { name: "Dozumu kullandım" }).click();
  await expect(page.getByRole("heading", { name: "Doz kaydı", level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Sol karın", exact: true }).click();
  await page.getByLabel("Not · isteğe bağlı").fill("Otomasyon testi");
  await page.getByRole("button", { name: "Kaydı tamamla" }).click();

  await page.getByRole("button", { name: "Geçmiş", exact: true }).click();
  await page.getByRole("button", { name: /Mounjaro · 12,5 mg/ }).click();
  await expect(page.getByRole("heading", { name: "Doz kaydı detayı", level: 1 })).toBeVisible();
  await expect(page.getByText("Otomasyon testi")).toBeVisible();

  await page.getByRole("button", { name: "Kaydı sil" }).click();
  await expect(page.getByRole("alertdialog")).toContainText("Doz kaydı silinsin mi?");
  await page.getByRole("alertdialog").getByRole("button", { name: "Kaydı sil" }).click();
  await expect(page.getByText("Henüz kayıt yok")).toBeVisible();
});

test("günlük kayıt eklenir ve düzenlenir", async ({ page }) => {
  await page.getByRole("button", { name: "Belirtiler", exact: true }).click();
  const appetite = page.getByRole("group", { name: "Bugün iştahın nasıldı?" });
  const energy = page.getByRole("group", { name: "Bugün enerjin nasıldı?" });
  await appetite.getByRole("button", { name: "4", exact: true }).click();
  await energy.getByRole("button", { name: "3", exact: true }).click();
  await page.getByRole("button", { name: "Yok", exact: true }).click();
  await page.locator(".weight-input input").fill("101.5");
  await page.getByRole("button", { name: "Kaydı tamamla" }).click();

  await page.getByRole("button", { name: "Geçmiş", exact: true }).click();
  await page.getByRole("group", { name: "Kayıt türü" }).getByRole("button", { name: "Günlük", exact: true }).click();
  await page.getByRole("button", { name: /^Günlük kayıt/ }).click();
  await expect(page.getByRole("heading", { name: "Günlük kayıt detayı", level: 1 })).toBeVisible();
  await expect(page.getByRole("dialog").getByText("101,5 kg", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Kaydı düzenle" }).click();
  await appetite.getByRole("button", { name: "5", exact: true }).click();
  await page.getByRole("button", { name: "Değişiklikleri kaydet" }).click();

  await page.getByRole("button", { name: /^Günlük kayıt/ }).click();
  await expect(page.getByText("5 / 5").first()).toBeVisible();
});

test("ilerleme ortalaması yalnızca bugünün kayıtlarından hesaplanır", async ({ page }) => {
  const current = today();
  const yesterday = isoDaysAgo(1);

  // seed() addInitScript kullanir ve her sayfa yuklemesinde yeniden calisir.
  // Bu yuzden localStorage'i elle yazmak yerine yeni bir seed kaydediyoruz,
  // aksi halde reload sirasinda ilk seed kayitlarin uzerine geri yaziyor.
  await seed(
    page,
    seededStore([
      { id: 1, date: current, appetite: 2, energy: 1, symptoms: ["Yok"], createdAt: `${current} 09:00` },
      { id: 2, date: current, appetite: 4, energy: 5, symptoms: ["Yok"], createdAt: `${current} 15:00` },
      { id: 3, date: yesterday, appetite: 5, energy: 5, symptoms: ["Yok"], createdAt: `${yesterday} 20:00` },
    ]),
  );
  await page.reload();

  await expect(page.getByRole("button", { name: "İştah · Ort. ilerlemesini aç" })).toContainText("3/5");
  await expect(page.getByRole("button", { name: "Enerji · Ort. ilerlemesini aç" })).toContainText("3/5");

  await page.getByRole("button", { name: "İştah · Ort. ilerlemesini aç" }).click();
  await page.getByRole("button", { name: "İştah kayıtlarını gör" }).click();
  await expect(page.getByRole("dialog")).toContainText("09:00’da eklendi");
  await expect(page.getByRole("dialog")).toContainText("15:00’da eklendi");
});

test("profil bilgileri görüntülenir ve düzenlenir", async ({ page }) => {
  await page.getByRole("button", { name: "Profilim" }).click();
  await expect(page.getByRole("dialog")).toContainText("Test Kullanıcısı");
  await page.getByRole("button", { name: "Profili düzenle" }).click();
  await page.getByLabel("İsim").fill("Yeni Test Adı");
  await page.getByRole("button", { name: "Kaydet" }).click();
  await expect(page.getByRole("dialog")).toContainText("Yeni Test Adı");
});

import type { Page } from "@playwright/test";

export type Daily = {
  id: number;
  date: string;
  appetite: number;
  energy: number;
  symptoms: string[];
  weight?: number;
  createdAt: string;
};

const today = () => {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
};

export function seededStore(dailies: Daily[] = []) {
  return {
    profile: {
      name: "Test Kullanıcısı",
      gender: "Belirtmek istemiyorum",
      birthDate: "1995-05-15",
      reminders: false,
      reminderTime: "09:00",
      onboarded: true,
    },
    dark: true,
    periods: [
      {
        id: 100,
        medication: "Mounjaro",
        ingredient: "Tirzepatid",
        dose: "12,5 mg",
        amount: "0,5 ml",
        start: today(),
        interval: "Her 7 günde bir",
        day: "Cuma",
        time: "20:00",
        active: true,
      },
    ],
    doses: [],
    dailies,
  };
}

export async function seed(page: Page, data = seededStore()) {
  await page.addInitScript((store) => {
    localStorage.setItem("dosekey-v2", JSON.stringify(store));
  }, data);
}

export async function clearDoseKey(page: Page) {
  await page.addInitScript(() => localStorage.removeItem("dosekey-v2"));
}

export const greetingFor = (name: string) => new RegExp(`(Günaydın|İyi günler|İyi akşamlar|İyi geceler|Merhaba),?\\s*${name}`);

export function isoDaysAgo(days: number) {
  const base = new Date(`${today()}T12:00:00`);
  base.setDate(base.getDate() - days);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
}

export { today };

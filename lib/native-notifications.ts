import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const REMINDER_IDS = Array.from({ length: 30 }, (_, index) => 7100 + index);

type ReminderInput = {
  enabled: boolean;
  date: string | null;
  time: string;
  interval: string;
  medication: string;
  dose: string;
};

const intervalDays = (interval: string) =>
  interval === "Her gün" ? 1 : Number(interval.match(/\d+/)?.[0] || 7);

export async function syncDoseReminders(input: ReminderInput) {
  if (!Capacitor.isNativePlatform()) return;

  await LocalNotifications.cancel({ notifications: REMINDER_IDS.map(id => ({ id })) });
  if (!input.enabled || !input.date) return;

  const permission = await LocalNotifications.checkPermissions();
  const status = permission.display === "granted"
    ? permission
    : await LocalNotifications.requestPermissions();
  if (status.display !== "granted") return;

  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = input.time.split(":").map(Number);
  const first = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (first.getTime() <= Date.now()) return;

  const days = intervalDays(input.interval);
  await LocalNotifications.schedule({
    notifications: REMINDER_IDS.map((id, index) => ({
      id,
      title: "Bugün doz günün",
      body: `${input.medication} ${input.dose} planını kontrol edebilirsin.`,
      schedule: {
        at: new Date(first.getTime() + index * days * 86_400_000),
        allowWhileIdle: true,
      },
      extra: { screen: "plan" },
    })),
  });
}

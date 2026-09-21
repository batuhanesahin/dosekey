import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";

// Android durum çubuğundaki saat ve simgeler uygulamanın temasına uysun.
// Aksi halde koyu temada koyu simgeler koyu zemin üzerinde görünmez oluyor.
export async function syncSystemBars(dark: boolean) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await SystemBars.setStyle({ style: dark ? SystemBarsStyle.Dark : SystemBarsStyle.Light });
  } catch {
    // Eski Android sürümlerinde desteklenmeyebilir; görünüm yine de çalışır.
  }
}

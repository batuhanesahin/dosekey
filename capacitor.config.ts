import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.batuhanegesahin.dosekey",
  appName: "DoseKey",
  webDir: "dist-mobile",
  backgroundColor: "#031a2c",
  plugins: {
    LocalNotifications: {
      iconColor: "#0788ff",
    },
  },
};

export default config;

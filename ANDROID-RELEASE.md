# DoseKey Android release notes

## Ready

- Capacitor Android project: `android/`
- Application ID: `com.batuhanegesahin.dosekey`
- Offline web bundle: `dist-mobile/` (generated, not committed)
- Local dose-day notifications with a user-selected time
- Android 13+ notification permission request
- Automatic device backup disabled for local health records
- DoseKey launcher icon
- Minimum Android version: Android 7 (API 24)
- Target SDK: API 36

## Build on the development Mac

1. Install the current stable Android Studio and its Android SDK.
2. Run `pnpm install` in the project directory.
3. Run `pnpm android:sync` after each web change.
4. Run `pnpm android:open` and choose the connected Android phone.
5. Enable USB debugging on the phone and press **Run** in Android Studio.

## Before the closed Play test

- Add daily-record edit/delete and complete-data deletion.
- Test reminder permission, denial, time changes, restart, and device reboot.
- Test data persistence after app update and confirm uninstall behavior.
- Test at 320 px width, large font, dark mode, and Android back navigation.
- Publish the privacy policy and add it to the app.
- Prepare the Play Store icon, feature graphic, screenshots, short description,
  full description, support email, Data safety form, and Health apps declaration.
- Create a signed Android App Bundle (`.aab`) for the closed test track.

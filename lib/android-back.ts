"use client";

import { useEffect } from "react";

// MainActivity forwards Android's Back button and edge gesture here. Radix
// dismisses only its topmost layer on Escape, so a Select or confirmation is
// closed before its parent dialog or the underlying page can be navigated.
export function useAndroidBack(enabled: boolean, goBack: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const handleBack = () => {
      const layer = document.querySelector(
        '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], [role="listbox"]',
      );
      if (layer) {
        document.dispatchEvent(new KeyboardEvent("keydown", {
          key: "Escape", code: "Escape", bubbles: true, cancelable: true,
        }));
        return;
      }
      goBack();
    };
    window.addEventListener("dosekey:back", handleBack);
    return () => window.removeEventListener("dosekey:back", handleBack);
  }, [enabled, goBack]);
}

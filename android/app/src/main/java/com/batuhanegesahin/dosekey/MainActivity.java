package com.batuhanegesahin.dosekey;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // All app pages share one WebView URL. Native URL history cannot
        // navigate React screens; let the UI dismiss a panel or go back.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge() != null && getBridge().getWebView() != null) {
                    getBridge().getWebView().evaluateJavascript(
                        "window.dispatchEvent(new Event('dosekey:back'));", null);
                }
                // Stay on the home screen when there is no earlier app page.
            }
        });
    }
}

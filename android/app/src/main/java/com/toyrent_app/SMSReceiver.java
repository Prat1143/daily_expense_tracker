package com.toyrent_app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;
import com.facebook.react.bridge.ReactContext;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.toyrent_app.MainApplication;

public class SMSReceiver extends BroadcastReceiver {
    private static final String TAG = "SMSReceiver";
    private static final Object lock = new Object(); // Add this line

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                Object[] pdus = (Object[]) bundle.get("pdus");
                if (pdus != null) {
                    StringBuilder fullMessageBody = new StringBuilder();
                    long timestamp = 0;
                    for (Object pdu : pdus) {
                        SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdu);
                        fullMessageBody.append(smsMessage.getMessageBody());
                        if (timestamp == 0) {
                            timestamp = smsMessage.getTimestampMillis();
                        }
                    }
                    String messageBody = fullMessageBody.toString();

                    // Use synchronization to prevent race conditions
                    synchronized (lock) {
                        // Check if this SMS has already been processed
                        if (!SMSStorage.isDuplicateSMS(context, messageBody, timestamp)) {
                            // Store SMS in SharedPreferences
                            SMSStorage.storeSMS(context, messageBody, timestamp);

                            // If the app is running, send event to React Native
                            sendEventToReactNative(context, messageBody, timestamp);
                        }
                    }
                }
            }
        }
    }

    private void sendEventToReactNative(Context context, String messageBody, long timestamp) {
        ReactContext reactContext = ((MainApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        if (reactContext != null) {
            WritableMap params = new WritableNativeMap();
            params.putString("messageBody", messageBody);
            params.putDouble("timestamp", (double) timestamp);

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onSMSReceived", params);
        }
    }
}
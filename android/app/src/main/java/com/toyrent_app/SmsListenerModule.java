package com.toyrent_app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.telephony.SmsMessage;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.module.annotations.ReactModule;

import java.util.List;

@ReactModule(name = SmsListenerModule.NAME)
public class SmsListenerModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SmsListenerModule";
    private final ReactApplicationContext reactContext;
    private BroadcastReceiver smsReceiver;

    public SmsListenerModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return NAME;
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void startListeningToSMS() {
        if (smsReceiver == null) {
            smsReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    if (intent.getAction().equals("android.provider.Telephony.SMS_RECEIVED")) {
                        Bundle bundle = intent.getExtras();
                        if (bundle != null) {
                            Object[] pdus = (Object[]) bundle.get("pdus");
                            if (pdus != null) {
                                for (Object pdu : pdus) {
                                    SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdu);
                                    
                                    WritableMap params = Arguments.createMap();
                                    params.putString("messageBody", smsMessage.getMessageBody());
                                    params.putString("senderPhoneNumber", smsMessage.getOriginatingAddress());
                                    params.putDouble("timestamp", (double) smsMessage.getTimestampMillis());

                                    // Store SMS in SMSStorage
                                    SMSStorage.storeSMS(reactContext, smsMessage.getMessageBody(), smsMessage.getTimestampMillis());

                                    sendEvent("onSMSReceived", params);
                                }
                            }
                        }
                    }
                }
            };

            IntentFilter filter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
            reactContext.registerReceiver(smsReceiver, filter);
        }
    }

    @ReactMethod
    public void stopListeningToSMS() {
        if (smsReceiver != null) {
            reactContext.unregisterReceiver(smsReceiver);
            smsReceiver = null;
        }
    }

    @ReactMethod
    public void checkStoredSMS() {
        List<SMSStorage.SMS> storedSMS = SMSStorage.getSMSList(reactContext);
        for (SMSStorage.SMS sms : storedSMS) {
            WritableMap params = Arguments.createMap();
            params.putString("messageBody", sms.messageBody);
            params.putDouble("timestamp", (double) sms.timestamp);

            sendEvent("onSMSReceived", params);
        }
        SMSStorage.clearSMSList(reactContext);
    }
}
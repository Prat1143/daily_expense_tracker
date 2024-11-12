package com.toyrent_app;

import android.content.Context;
import android.content.SharedPreferences;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class SMSStorage {
    private static final String PREF_NAME = "SMSStorage";
    private static final String SMS_LIST_KEY = "sms_list";

    public static void storeSMS(Context context, String messageBody, long timestamp) {
        List<SMS> smsList = getSMSList(context);
        smsList.add(new SMS(messageBody, timestamp));
        saveSMSList(context, smsList);
    }

    public static boolean isDuplicateSMS(Context context, String messageBody, long timestamp) {
        List<SMS> smsList = getSMSList(context);
        for (SMS sms : smsList) {
            if (sms.messageBody.equals(messageBody) && Math.abs(sms.timestamp - timestamp) < 1000) {
                return true;
            }
        }
        return false;
    }

    public static List<SMS> getSMSList(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        String json = prefs.getString(SMS_LIST_KEY, null);
        if (json == null) {
            return new ArrayList<>();
        } else {
            Type type = new TypeToken<List<SMS>>() {}.getType();
            return new Gson().fromJson(json, type);
        }
    }

    private static void saveSMSList(Context context, List<SMS> smsList) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        String json = new Gson().toJson(smsList);
        editor.putString(SMS_LIST_KEY, json);
        editor.apply();
    }

    public static void clearSMSList(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.remove(SMS_LIST_KEY);
        editor.apply();
    }

    public static class SMS {
        String messageBody;
        long timestamp;

        SMS(String messageBody, long timestamp) {
            this.messageBody = messageBody;
            this.timestamp = timestamp;
        }
    }
}
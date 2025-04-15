package com.example.aarogyalekha;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "LoginSession";
    private static final String KEY_IS_LOGGED_IN = "isLoggedIn";
    private static final String KEY_PATIENT_ID = "patientID";

    private final SharedPreferences pref;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        pref = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = pref.edit();
    }

    // Save Login Session
    public void saveLoginSession(String patientID) {
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putString(KEY_PATIENT_ID, patientID);
        editor.apply();
    }

    // Check if user is logged in
    public boolean isLoggedIn() {
        return pref.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    // Get stored Patient ID
    public String getPatientID() {
        return pref.getString(KEY_PATIENT_ID, null);
    }

    // Logout User
    public void logout() {
        editor.clear();
        editor.apply();
    }
}

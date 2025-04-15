package com.example.aarogyalekha;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.firestore.FirebaseFirestore;

public class MainActivity extends AppCompatActivity {

    SessionManager sessionManager;
    String patientID; // Declare patientID

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sessionManager = new SessionManager(this);

        if (sessionManager.isLoggedIn()) {
            // Retrieve patient ID
            patientID = sessionManager.getPatientID();

            // Store FCM token only if logged in
            storeFCMToken();

            // Start Firestore Listener Service only if user is logged in
            Intent serviceIntent = new Intent(this, FirestoreListenerService.class);
            serviceIntent.putExtra("patientID", patientID);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }

            // Redirect to Dashboard
            Intent intent = new Intent(this, PatientDashboardActivity.class);
            intent.putExtra("PATIENT_ID", patientID);
            startActivity(intent);
            finish(); // Close MainActivity
        }

        // Find buttons in layout
        Button btnUserLogin = findViewById(R.id.btnUserLogin);
        Button btnAboutUs = findViewById(R.id.btnAboutUs);
        Button btnContactUs = findViewById(R.id.btnContactUs);
        Button btnFAQs = findViewById(R.id.btnFAQs);

        // Check if buttons exist before setting click listeners
        if (btnUserLogin != null) {
            btnUserLogin.setOnClickListener(view -> openActivity(UserLoginActivity.class));
        }

        if (btnAboutUs != null) {
            btnAboutUs.setOnClickListener(view -> openActivity(AboutUsActivity.class));
        }

        if (btnContactUs != null) {
            btnContactUs.setOnClickListener(view -> openActivity(ContactUsActivity.class));
        }

        if (btnFAQs != null) {
            btnFAQs.setOnClickListener(view -> openActivity(FAQsActivity.class));
        }
    }

    private void storeFCMToken() {
        if (patientID == null || patientID.isEmpty()) {
            Log.e("FCM", "❌ Cannot store FCM token: Patient ID is null or empty!");
            return;
        }

        FirebaseMessaging.getInstance().getToken().addOnSuccessListener(token -> {
            FirebaseFirestore db = FirebaseFirestore.getInstance();
            db.collection("users").document(patientID)
                    .update("fcmToken", token)
                    .addOnSuccessListener(aVoid -> Log.d("FCM", "✅ Token stored successfully"))
                    .addOnFailureListener(e -> Log.e("FCM", "❌ Error storing token", e));
        });
    }

    // Generic function to open activities
    private void openActivity(Class<?> activityClass) {
        Intent intent = new Intent(MainActivity.this, activityClass);
        startActivity(intent);
    }
}

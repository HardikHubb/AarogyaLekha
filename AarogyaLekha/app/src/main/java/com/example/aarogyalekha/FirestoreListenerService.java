package com.example.aarogyalekha;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

public class FirestoreListenerService extends Service {
    private static final String CHANNEL_ID = "medical_updates_channel";
    private ListenerRegistration medicalHistoryListener;
    private FirebaseFirestore db = FirebaseFirestore.getInstance();

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("AarogyaLekha Monitoring")
                .setContentText("Listening for medical updates…")
                .setSmallIcon(R.drawable.ic_notification)
                .build();

        startForeground(1, notification);

        if (intent != null && intent.hasExtra("patientID")) {
            String patientID = intent.getStringExtra("patientID");
            listenForMedicalHistoryUpdates(patientID);
        } else {
            Log.e("FirestoreListener", "❌ No patient ID provided!");
        }

        return START_STICKY;
    }

    private void listenForMedicalHistoryUpdates(String patientID) {
        if (patientID == null || patientID.isEmpty()) {
            Log.e("FirestoreListener", "❌ Patient ID is null or empty!");
            return;
        }

        medicalHistoryListener = db.collection("patients").document(patientID).collection("diseases")
                .addSnapshotListener((queryDocumentSnapshots, error) -> {
                    if (error != null) {
                        Log.e("FirestoreListener", "❌ Error listening for updates", error);
                        return;
                    }

                    if (queryDocumentSnapshots != null && !queryDocumentSnapshots.isEmpty()) {
                        Log.d("FirestoreListener", "📡 Firestore detected changes! Size: " + queryDocumentSnapshots.size());

                        for (QueryDocumentSnapshot document : queryDocumentSnapshots) {
                            Log.d("FirestoreListener", "🔹 Updated Disease: " + document.getId());
                        }

                        // Send notification only when there are changes
                        sendNotification("Medical History Updated", "Your medical records have been updated.", patientID);
                    } else {
                        Log.d("FirestoreListener", "⚠️ No changes detected in Firestore.");
                    }
                });
    }

    private void sendNotification(String title, String message, String patientID) {
        Intent intent = new Intent(this, PatientDashboardActivity.class);
        intent.putExtra("PATIENT_ID", patientID); // Pass patient ID correctly
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);

        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(100, builder.build());
        }
    }




    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, "Medical Updates", NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Notifies users when their medical history is updated");

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    @Override
    public void onDestroy() {
        if (medicalHistoryListener != null) {
            medicalHistoryListener.remove();
        }
        Log.d("FirestoreListener", "🛑 Service destroyed");
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

package com.example.aarogyalekha;

import android.Manifest;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.pdf.PdfDocument;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.bumptech.glide.Glide;
import com.google.firebase.firestore.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PatientDashboardActivity extends AppCompatActivity {
    private FirebaseFirestore db;
    private String patientID;
    private SessionManager sessionManager;
    private ListenerRegistration patientListener;
    private ListenerRegistration medicalHistoryListener;
    private static final String CHANNEL_ID = "patient_updates";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_patient_dashboard);

        // Request notification permission for Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }


        createNotificationChannel(); // Create notification channel

        sessionManager = new SessionManager(this);

        // Log to check if intent contains extras
        if (getIntent() != null && getIntent().getExtras() != null) {
            Log.d("Dashboard", "📲 Opened from Notification with Extras: " + getIntent().getExtras().toString());
        } else {
            Log.d("Dashboard", "⚠ Intent received, but no extras found.");
        }

        patientID = getIntent().getStringExtra("PATIENT_ID");

        if (patientID == null || patientID.isEmpty()) {
            Log.e("Dashboard", "❌ Patient ID is missing! Intent Extras: " + getIntent().getExtras());
            Toast.makeText(this, "Patient ID not found", Toast.LENGTH_SHORT).show();
            return; // Don't finish activity immediately, just prevent further processing
        }

        Log.d("Dashboard", "✅ Retrieved patientId: " + patientID);

        Button logoutButton = findViewById(R.id.btnLogout);
        logoutButton.setOnClickListener(v -> {
            sessionManager.logout();
            Intent intent = new Intent(PatientDashboardActivity.this, UserLoginActivity.class);
            startActivity(intent);
            finish();
        });

        db = FirebaseFirestore.getInstance();

        // Start real-time listeners
        listenForChronicDiseasesUpdates();
        listenForPatientUpdates();
        listenForMedicalHistoryUpdates();
        loadLabReports();
    }

    private void sendNotification(String title, String message) {
        Intent intent = new Intent(this, PatientDashboardActivity.class);
        intent.putExtra("PATIENT_ID", patientID);  // Ensure Patient ID is passed in the notification intent

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) {
            notificationManager.notify(1, builder.build());
        }
    }

    private void listenForMedicalHistoryUpdates() {
        medicalHistoryListener = db.collection("patients").document(patientID).collection("diseases")
                .addSnapshotListener((queryDocumentSnapshots, error) -> {
                    if (error != null) {
                        Log.e("DEBUG", "❌ Firestore Listener Error: ", error);
                        return;
                    }
                    if (queryDocumentSnapshots == null) {
                        Log.d("DEBUG", "⚠ Firestore Listener triggered but no documents found.");
                        return;
                    }

                    Log.d("DEBUG", "✅ Firestore Listener triggered: " + queryDocumentSnapshots.size() + " records");

                    List<String> newDiseases = new ArrayList<>();
                    for (QueryDocumentSnapshot document : queryDocumentSnapshots) {
                        newDiseases.add(document.getId());
                    }

                    // Retrieve stored data
                    SharedPreferences prefs = getSharedPreferences("AppPrefs", MODE_PRIVATE);
                    String previousDiseasesJson = prefs.getString("previousDiseases", "[]");
                    Gson gson = new Gson();
                    List<String> previousDiseases = gson.fromJson(previousDiseasesJson, new TypeToken<List<String>>() {}.getType());

                    // Sort lists before comparing
                    Collections.sort(newDiseases);
                    Collections.sort(previousDiseases);

                    if (!previousDiseases.equals(newDiseases)) {
                        sendNotification("Medical History Updated", "Your medical records have been updated.");

                        SharedPreferences.Editor editor = prefs.edit();
                        editor.putString("previousDiseases", gson.toJson(newDiseases));
                        editor.apply();
                    }

                    Log.d("DEBUG", "🔄 Medical history changed: " + queryDocumentSnapshots.size() + " records");

                    // Update UI
                    LinearLayout medicalHistoryContainer = findViewById(R.id.medicalHistoryContainer);
                    medicalHistoryContainer.removeAllViews();

                    for (QueryDocumentSnapshot document : queryDocumentSnapshots) {
                        Disease disease = document.toObject(Disease.class);
                        View diseaseView = getLayoutInflater().inflate(R.layout.item_disease, medicalHistoryContainer, false);

                        // Adding labels before data
                        ((TextView) diseaseView.findViewById(R.id.tvDiseaseName))
                                .setText("Disease Name: " + disease.getDiseaseName());

                        ((TextView) diseaseView.findViewById(R.id.tvSymptoms))
                                .setText("Symptoms: " + disease.getSymptoms());

                        ((TextView) diseaseView.findViewById(R.id.tvMedication))
                                .setText("Medication: " + disease.getMedication());

                        ((TextView) diseaseView.findViewById(R.id.tvRemarks))
                                .setText("Remarks: " + disease.getRemarks());

                        ((TextView) diseaseView.findViewById(R.id.tvDoctor))
                                .setText("Doctor: " + disease.getDoctor());

                        ((TextView) diseaseView.findViewById(R.id.tvAdmitDate))
                                .setText("Admit Date: " + disease.getAdmitDate());

                        medicalHistoryContainer.addView(diseaseView);
                    }
                });
    }

    private void listenForPatientUpdates() {
        patientListener = db.collection("patients").document(patientID)
                .addSnapshotListener((documentSnapshot, error) -> {
                    if (error != null) {
                        Log.e("DEBUG", "❌ Error listening for patient updates", error);
                        return;
                    }
                    if (documentSnapshot != null && documentSnapshot.exists()) {
                        Map<String, Object> newPatientData = documentSnapshot.getData();

                        // Retrieve stored data
                        SharedPreferences prefs = getSharedPreferences("AppPrefs", MODE_PRIVATE);
                        String previousDataJson = prefs.getString("previousPatientData", "{}");
                        Gson gson = new Gson();
                        Map<String, Object> previousPatientData = gson.fromJson(previousDataJson, HashMap.class);

                        if (!previousPatientData.equals(newPatientData)) {
                            // Only send notification if actual data changed
                            sendNotification("Patient Details Updated", "Your personal information has been updated.");

                            // Store new patient data
                            SharedPreferences.Editor editor = prefs.edit();
                            editor.putString("previousPatientData", gson.toJson(newPatientData));
                            editor.apply();
                        }

                        Log.d("DEBUG", "🔄 Patient data changed: " + documentSnapshot.getData());

                        // Update UI
                        ((TextView) findViewById(R.id.tvPatientID)).setText(patientID);
                        ((TextView) findViewById(R.id.tvPatientName)).setText(documentSnapshot.getString("patientName"));
                        ((TextView) findViewById(R.id.tvPatientAge)).setText(documentSnapshot.getString("patientAge"));
                        ((TextView) findViewById(R.id.tvPatientGender)).setText(documentSnapshot.getString("gender"));
                        ((TextView) findViewById(R.id.tvPatientAddress)).setText(documentSnapshot.getString("address"));
                        ((TextView) findViewById(R.id.tvPatientBloodGroup)).setText(documentSnapshot.getString("bloodGroup"));
                        ((TextView) findViewById(R.id.tvPatientContact)).setText(documentSnapshot.getString("contact"));
                        ((TextView) findViewById(R.id.tvPatientSecondaryContact)).setText(documentSnapshot.getString("secondaryContact"));
                        ((TextView) findViewById(R.id.tvPatientDOB)).setText(documentSnapshot.getString("dob"));

                        // Check for profile image update
                        String profileImage = documentSnapshot.getString("profileImage");
                        ImageView patientImage = findViewById(R.id.patientProfileImage);
                        if (profileImage != null && !profileImage.isEmpty()) {
                            Glide.with(this).load(profileImage)
                                    .placeholder(R.drawable.default_profile)
                                    .into(patientImage);
                        }
                    }
                });
    }

    private void listenForChronicDiseasesUpdates() {
        db.collection("patients").document(patientID).collection("chronicdiseases")
                .addSnapshotListener((queryDocumentSnapshots, error) -> {
                    if (error != null) {
                        Log.e("DEBUG", "❌ Error listening for chronic disease updates", error);
                        return;
                    }

                    if (queryDocumentSnapshots != null) {
                        Log.d("DEBUG", "🔄 Chronic diseases updated: " + queryDocumentSnapshots.size() + " records");

                        LinearLayout chronicDiseaseContainer = findViewById(R.id.chronicDiseaseContainer);
                        chronicDiseaseContainer.removeAllViews(); // Clear previous views

                        for (QueryDocumentSnapshot document : queryDocumentSnapshots) {
                            ChronicDisease chronicDisease = document.toObject(ChronicDisease.class);
                            View chronicDiseaseView = getLayoutInflater().inflate(R.layout.item_chronic_disease, chronicDiseaseContainer, false);

                            // Adding labels before data
                            ((TextView) chronicDiseaseView.findViewById(R.id.tvChronicDiseaseName))
                                    .setText("Disease Name: " + chronicDisease.getChronicDiseaseName());

                            ((TextView) chronicDiseaseView.findViewById(R.id.tvChronicSymptoms))
                                    .setText("Symptoms: " + chronicDisease.getChronicSymptoms());

                            ((TextView) chronicDiseaseView.findViewById(R.id.tvChronicMedication))
                                    .setText("Current Medications: " + chronicDisease.getCurrentMedications());

                            ((TextView) chronicDiseaseView.findViewById(R.id.tvChronicRemarks))
                                    .setText("Remarks: " + chronicDisease.getChronicRemarks());

                            ((TextView) chronicDiseaseView.findViewById(R.id.tvChronicDoctor))
                                    .setText("Doctor: " + chronicDisease.getChronicDoctor());

                            ((TextView) chronicDiseaseView.findViewById(R.id.tvChronicAdmitDate))
                                    .setText("Diagnosis Date: " + chronicDisease.getChronicDiseaseDate());

                            chronicDiseaseContainer.addView(chronicDiseaseView);
                        }
                    }
                });
    }

    private void loadLabReports() {
        db.collection("patients").document(patientID)
                .addSnapshotListener((documentSnapshot, error) -> {
                    if (error != null) {
                        Log.e("DEBUG", "❌ Error fetching lab reports", error);
                        return;
                    }

                    if (documentSnapshot != null && documentSnapshot.exists()) {
                        List<Map<String, Object>> reportsList = (List<Map<String, Object>>) documentSnapshot.get("reports");

                        if (reportsList != null && !reportsList.isEmpty()) {
                            Log.d("DEBUG", "✅ Lab Reports Loaded: " + reportsList.size() + " reports");

                            LinearLayout labReportsContainer = findViewById(R.id.labReportsContainer);
                            labReportsContainer.removeAllViews();

                            for (Map<String, Object> reportData : reportsList) {
                                String date = (String) reportData.get("date");
                                String type = (String) reportData.get("type");
                                String url = (String) reportData.get("url"); // ✅ Make sure Firestore has the correct field

                                LabReport report = new LabReport(date, type, url);
                                View reportView = getLayoutInflater().inflate(R.layout.item_lab_report, labReportsContainer, false);

                                ((TextView) reportView.findViewById(R.id.tvLabReportDate)).setText("Date: " + report.getDate());
                                ((TextView) reportView.findViewById(R.id.tvLabReportType)).setText("Type: " + report.getType());

                                Button btnViewReport = reportView.findViewById(R.id.btnViewLabReport);
                                btnViewReport.setOnClickListener(v -> showImageDialog(report.getUrl())); // ✅ Updated

                                labReportsContainer.addView(reportView);
                            }
                        } else {
                            Log.d("DEBUG", "⚠ No Lab Reports found.");
                        }
                    }
                });
    }

    /**
     * Shows the lab report image in a dialog
     */
    private void showImageDialog(String imageUrl) {
        Log.d("DEBUG", "🔗 Report Image URL: " + imageUrl);

        if (imageUrl == null || imageUrl.isEmpty()) {
            Log.e("DEBUG", "❌ Invalid image URL");
            Toast.makeText(this, "No image available", Toast.LENGTH_SHORT).show();
            return;
        }

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_lab_report, null);
        ImageView reportImageView = dialogView.findViewById(R.id.reportImageView);
        Button closeButton = dialogView.findViewById(R.id.btnCloseReportDialog);
        Button downloadButton = dialogView.findViewById(R.id.btnDownloadReport);

        Glide.with(this)
                .load(imageUrl)
                .placeholder(R.drawable.loading_placeholder)
                .error(R.drawable.error_placeholder)
                .into(reportImageView);

        builder.setView(dialogView);
        AlertDialog dialog = builder.create();
        dialog.show();

        // Close Button Listener
        closeButton.setOnClickListener(v -> {
            Log.d("DEBUG", "🛑 Closing dialog...");
            dialog.dismiss();
        });

        // Download Button Listener
        downloadButton.setOnClickListener(v -> {
            Log.d("DEBUG", "⬇ Downloading image...");
            downloadImage(imageUrl);
        });
    }

    private void downloadImage(String imageUrl) {
        try {
            DownloadManager downloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            Uri uri = Uri.parse(imageUrl);

            DownloadManager.Request request = new DownloadManager.Request(uri);
            request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI | DownloadManager.Request.NETWORK_MOBILE);
            request.setTitle("Lab Report");
            request.setDescription("Downloading report image...");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "lab_report.jpg");

            if (downloadManager != null) {
                downloadManager.enqueue(request);
                Toast.makeText(this, "Download started...", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            Log.e("DEBUG", "❌ Download failed: " + e.getMessage());
            Toast.makeText(this, "Download failed", Toast.LENGTH_SHORT).show();
        }
    }

    private void generatePDF() {
        // 🔹 Check and request permissions for Android 9 (Pie) and below
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                return;
            }
        }

        // 📜 Capture Full ScrollView Content
        ScrollView dashboardView = findViewById(R.id.dashboardScrollView);
        int totalHeight = dashboardView.getChildAt(0).getHeight();
        int totalWidth = dashboardView.getWidth();
        Bitmap bitmap = Bitmap.createBitmap(totalWidth, totalHeight, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        dashboardView.draw(canvas);

        // 📂 Save in Downloads folder
        String fileName = "PatientDashboard.pdf";
        ContentResolver resolver = getContentResolver();
        ContentValues contentValues = new ContentValues();
        contentValues.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
        contentValues.put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf");
        contentValues.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

        Uri pdfUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues);

        if (pdfUri == null) {
            Toast.makeText(this, "Error creating PDF file", Toast.LENGTH_SHORT).show();
            return;
        }

        try (OutputStream outputStream = resolver.openOutputStream(pdfUri)) {
            if (outputStream == null) {
                Toast.makeText(this, "Error accessing file", Toast.LENGTH_SHORT).show();
                return;
            }

            // 📝 Create PDF Document
            PdfDocument pdfDocument = new PdfDocument();
            PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(totalWidth, totalHeight, 1).create();
            PdfDocument.Page page = pdfDocument.startPage(pageInfo);
            page.getCanvas().drawBitmap(bitmap, 0, 0, null);
            pdfDocument.finishPage(page);
            pdfDocument.writeTo(outputStream);
            pdfDocument.close();

            Toast.makeText(this, "PDF saved in Downloads", Toast.LENGTH_SHORT).show();

            // 📂 Open PDF after saving
            openPDF(pdfUri);

        } catch (IOException e) {
            Log.e("DEBUG", "❌ Error saving PDF", e);
            Toast.makeText(this, "Failed to save PDF", Toast.LENGTH_SHORT).show();
        }
    }

    // Method to open the generated PDF
    private void openPDF(Uri pdfUri) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(pdfUri, "application/pdf");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivity(Intent.createChooser(intent, "Open PDF"));
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Patient Updates",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Notifications for patient record changes");

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (patientListener != null) {
            patientListener.remove();
        }
        if (medicalHistoryListener != null) {
            medicalHistoryListener.remove();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                generatePDF(); // Retry generating PDF if permission granted
            } else {
                Toast.makeText(this, "Permission denied to write to storage", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
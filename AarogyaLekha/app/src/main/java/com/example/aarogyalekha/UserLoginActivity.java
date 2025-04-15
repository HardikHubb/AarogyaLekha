package com.example.aarogyalekha;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class UserLoginActivity extends AppCompatActivity {

    private EditText etPatientID, etPassword;
    private FirebaseFirestore db;

    SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_login);

        sessionManager = new SessionManager(this);

        Button loginButton = findViewById(R.id.btnLogin);
        EditText etPatientID = findViewById(R.id.etPatientID);
        EditText etPassword = findViewById(R.id.etPassword);

        loginButton.setOnClickListener(v -> {
            String patientID = etPatientID.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (patientID.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter Patient ID and Password", Toast.LENGTH_SHORT).show();
                return;
            }

            // Check credentials in Firestore
            FirebaseFirestore.getInstance().collection("patients")
                    .document(patientID)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        if (documentSnapshot.exists()) {
                            String storedPassword = documentSnapshot.getString("password");

                            if (storedPassword != null && storedPassword.equals(password)) {
                                // Save login session
                                sessionManager.saveLoginSession(patientID);

                                // Open Dashboard
                                Intent intent = new Intent(UserLoginActivity.this, PatientDashboardActivity.class);
                                intent.putExtra("PATIENT_ID", patientID);
                                startActivity(intent);
                                finish(); // Close login activity
                            } else {
                                Toast.makeText(this, "Incorrect password", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(this, "Patient ID not found", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnFailureListener(e -> Toast.makeText(this, "Login failed. Try again.", Toast.LENGTH_SHORT).show());
        });
    }
}

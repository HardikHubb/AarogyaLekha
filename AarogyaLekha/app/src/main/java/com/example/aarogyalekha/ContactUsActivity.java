package com.example.aarogyalekha;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class ContactUsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_us);

        // Email Click
        TextView tvEmail = findViewById(R.id.tvEmail);
        tvEmail.setOnClickListener(v -> {
            Intent emailIntent = new Intent(Intent.ACTION_SENDTO);
            emailIntent.setData(Uri.parse("mailto:help.aarogyyalekha@gmail.com"));
            try {
                startActivity(Intent.createChooser(emailIntent, "Send Email"));
            } catch (android.content.ActivityNotFoundException ex) {
                Toast.makeText(ContactUsActivity.this, "No email app found!", Toast.LENGTH_SHORT).show();
            }
        });

        // LinkedIn Click
        TextView tvLinkedIn = findViewById(R.id.tvLinkedIn);
        tvLinkedIn.setOnClickListener(v -> {
            String linkedInUrl = "https://www.linkedin.com/in/@AarogyaLekha"; // Replace with actual LinkedIn URL
            Intent linkedInIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(linkedInUrl));
            startActivity(linkedInIntent);
        });

        // X Profile Click
        TextView tvXProfile = findViewById(R.id.tvXProfile);
        tvXProfile.setOnClickListener(v -> {
            String xProfileUrl = "https://twitter.com/_AarogyaLekha"; // Replace with actual X profile URL
            Intent xIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(xProfileUrl));
            startActivity(xIntent);
        });


    }
}

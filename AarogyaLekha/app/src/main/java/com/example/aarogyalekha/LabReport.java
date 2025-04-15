package com.example.aarogyalekha;

public class LabReport {
    private String date;
    private String type;
    private String url; // ✅ Ensure this matches Firestore field name

    // Default constructor (needed for Firestore deserialization)
    public LabReport() {}

    public LabReport(String date, String type, String url) {
        this.date = date;
        this.type = type;
        this.url = url;
    }

    public String getDate() {
        return date;
    }

    public String getType() {
        return type;
    }

    public String getUrl() { // ✅ Ensure this method exists
        return url;
    }
}

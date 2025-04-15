package com.example.aarogyalekha;

public class Disease {
    private String diseaseName, symptoms, medication, remarks, doctor, admitDate;

    public Disease() { }  // Empty constructor for Firestore

    public String getDiseaseName() { return diseaseName; }
    public String getSymptoms() { return symptoms; }
    public String getMedication() { return medication; }
    public String getRemarks() { return remarks; }
    public String getDoctor() { return doctor; }
    public String getAdmitDate() { return admitDate; }
}

package com.example.aarogyalekha;

public class ChronicDisease {
    private String chronicDiseaseName;
    private String chronicDiseaseDate;
    private String chronicDoctor;
    private String chronicRemarks;
    private String chronicSurgeries;
    private String chronicSymptoms;
    private String currentMedications;
    private String currentTherapy;

    // Empty constructor required for Firestore deserialization
    public ChronicDisease() {}

    public ChronicDisease(String chronicDiseaseName, String chronicDiseaseDate, String chronicDoctor,
                          String chronicRemarks, String chronicSurgeries, String chronicSymptoms,
                          String currentMedications, String currentTherapy) {
        this.chronicDiseaseName = chronicDiseaseName;
        this.chronicDiseaseDate = chronicDiseaseDate;
        this.chronicDoctor = chronicDoctor;
        this.chronicRemarks = chronicRemarks;
        this.chronicSurgeries = chronicSurgeries;
        this.chronicSymptoms = chronicSymptoms;
        this.currentMedications = currentMedications;
        this.currentTherapy = currentTherapy;
    }

    // Getters
    public String getChronicDiseaseName() {
        return chronicDiseaseName;
    }

    public String getChronicDiseaseDate() {
        return chronicDiseaseDate;
    }

    public String getChronicDoctor() {
        return chronicDoctor;
    }

    public String getChronicRemarks() {
        return chronicRemarks;
    }

    public String getChronicSurgeries() {
        return chronicSurgeries;
    }

    public String getChronicSymptoms() {
        return chronicSymptoms;
    }

    public String getCurrentMedications() {
        return currentMedications;
    }

    public String getCurrentTherapy() {
        return currentTherapy;
    }

    // Setters (if needed)
    public void setChronicDiseaseName(String chronicDiseaseName) {
        this.chronicDiseaseName = chronicDiseaseName;
    }

    public void setChronicDiseaseDate(String chronicDiseaseDate) {
        this.chronicDiseaseDate = chronicDiseaseDate;
    }

    public void setChronicDoctor(String chronicDoctor) {
        this.chronicDoctor = chronicDoctor;
    }

    public void setChronicRemarks(String chronicRemarks) {
        this.chronicRemarks = chronicRemarks;
    }

    public void setChronicSurgeries(String chronicSurgeries) {
        this.chronicSurgeries = chronicSurgeries;
    }

    public void setChronicSymptoms(String chronicSymptoms) {
        this.chronicSymptoms = chronicSymptoms;
    }

    public void setCurrentMedications(String currentMedications) {
        this.currentMedications = currentMedications;
    }

    public void setCurrentTherapy(String currentTherapy) {
        this.currentTherapy = currentTherapy;
    }
}

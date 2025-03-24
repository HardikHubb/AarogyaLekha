import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsDXa7OmJ2wcpaoV7RRJKBh6ithhABp7o",
    authDomain: "aarogya-lekha.firebaseapp.com",
    projectId: "aarogya-lekha",
    storageBucket: "aarogya-lekha.appspot.com",
    messagingSenderId: "253609387970",
    appId: "1:253609387970:web:66adac86ff86d88853185b",
    measurementId: "G-JH2F1H03S6"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase App:", app);
console.log("Firestore DB:", db);

// ✅ Export for other modules (optional)
export { app, db };

document.addEventListener("DOMContentLoaded", function () {
    let foundPatient = localStorage.getItem("selectedPatient");

    if (foundPatient) {
        // Convert JSON string to Object
        foundPatient = JSON.parse(foundPatient);

        console.log("Patient Data Found:", foundPatient); // Debugging Line

        // Check if all properties exist
        document.getElementById("patient-info").innerHTML = `
            <div class="patient-grid">
                <div><strong>ID:</strong> ${foundPatient.patientId || "N/A"}</div>
                <div><strong>Name:</strong> ${foundPatient.patientName || "N/A"}</div>
                <div><strong>Age:</strong> ${foundPatient.patientAge || "N/A"}</div>
                <div><strong>DOB:</strong> ${foundPatient.dob || "N/A"}</div>
                <div><strong>Address:</strong> ${foundPatient.address || "N/A"}</div>
                <div><strong>Contact:</strong> ${foundPatient.contact || "N/A"}</div>
                <div><strong>Secondary Contact:</strong> ${foundPatient.secondaryContact || "N/A"}</div>
                <div><strong>Blood Group:</strong> ${foundPatient.bloodGroup || "N/A"}</div>
                <div><strong>Gender:</strong> ${foundPatient.gender || "N/A"}</div>
            </div>
        `;
    } else {
        console.log("No patient data found in localStorage!");
        document.getElementById("patient-info").innerHTML = "<p>No patient data found!</p>";
    }
});


function openTab(event, tabName) {
    // Hide all tab content
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
    });

    // Remove "active" class from all buttons
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    // Show the selected tab
    document.getElementById(tabName).style.display = "block";

    // Set the clicked button as active
    event.currentTarget.classList.add("active");
}

// ✅ Attach function to window so it's globally available
window.openTab = openTab;

// ✅ Set default tab on page load
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("patient-details").style.display = "block";
});

document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("save-btn");
    if (saveButton) {
        saveButton.addEventListener("click", async function () {
            await saveDisease();
        });
    } else {
        console.error("❌ Error: Save button not found! Check the ID in HTML.");
    }
});


// ✅ Function to Save Disease Details to Firestore
let isSaving = false; // Prevent multiple submissions

async function saveDisease() {
    if (isSaving) return; // Stop duplicate calls
    isSaving = true;

    const saveButton = document.getElementById("save-btn");
    saveButton.disabled = true; // Disable button

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) {
        console.error("❌ Error: No patient selected!");
        alert("⚠ No patient selected!");
        isSaving = false;
        saveButton.disabled = false;
        return;
    }

    console.log("✅ Selected Patient ID:", patientId);

    // 📌 Get Form Data
    const diseaseName = document.getElementById("condition").value.trim();
    const symptoms = document.getElementById("symptoms").value.trim();
    const doctor = document.getElementById("doctor").value.trim();
    const admitDate = document.getElementById("admit-date").value.trim();
    const medication = document.getElementById("medication").value.trim();
    const remarks = document.getElementById("remarks").value.trim();

    if (!diseaseName || !symptoms || !doctor || !admitDate) {
        alert("⚠ Please fill all required fields!");
        isSaving = false;
        saveButton.disabled = false;
        return;
    }

    // 🔥 Check if Disease Already Exists for the Patient
    const diseaseRef = collection(db, "patients", patientId, "diseases");
    const querySnapshot = await getDocs(diseaseRef);

    let isDuplicate = false;
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
            data.diseaseName === diseaseName &&
            data.admitDate === admitDate &&
            data.doctor === doctor
        ) {
            isDuplicate = true;
        }
    });

    if (isDuplicate) {
        alert("⚠ This disease entry already exists for this patient!");
        isSaving = false;
        saveButton.disabled = false;
        return;
    }

    // ✅ Save Data
    try {
        await addDoc(diseaseRef, {
            diseaseName,
            symptoms,
            doctor,
            admitDate,
            medication,
            remarks,
            timestamp: new Date().toISOString(),
        });

        console.log("✅ Disease saved successfully!");

        // ✅ Clear form
        document.getElementById("condition").value = "";
        document.getElementById("symptoms").value = "";
        document.getElementById("doctor").value = "";
        document.getElementById("admit-date").value = "";
        document.getElementById("medication").value = "";
        document.getElementById("remarks").value = "";

        fetchDiseases(); // Refresh table
    } catch (error) {
        console.error("❌ Error saving disease:", error);
        alert("⚠ Failed to save disease!");
    }

    isSaving = false;
    saveButton.disabled = false; // Re-enable button
}


// ✅ Function to Fetch & Display Diseases from Firestore
async function fetchDiseases() {
    console.log("🔄 Fetching diseases...");

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) {
        console.error("❌ No patient selected for fetching diseases.");
        return;
    }

    console.log("✅ Fetching diseases for Patient ID:", patientId);

    const diseaseRef = collection(db, "patients", patientId, "diseases");
    const diseaseContainer = document.getElementById("disease-container");

    if (!diseaseContainer) {
        console.error("❌ Element #disease-container not found!");
        return;
    }

    diseaseContainer.innerHTML = ""; // ✅ Clear previous data before adding new cards

    try {
        const querySnapshot = await getDocs(diseaseRef);
        console.log("📜 Total diseases found:", querySnapshot.size);

        if (querySnapshot.empty) {
            diseaseContainer.innerHTML = "<p>No records available</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("📌 Disease Data:", data);

            // Create a disease card with collapsible details
            const diseaseCard = document.createElement("div");
            diseaseCard.classList.add("disease-card");

            diseaseCard.innerHTML = `
                <div class="disease-header" onclick="toggleDetails(this)">
                    <strong>${data.diseaseName || "Unknown Disease"}</strong> 
                    
                </div>
                <div class="disease-details hidden">
                    <p><strong>Symptoms:</strong> ${data.symptoms || "N/A"}</p>
                    <p><strong>Doctor:</strong> ${data.doctor || "N/A"}</p>
                    <p><strong>Date:</strong> ${data.admitDate || "N/A"}</p>
                    <p><strong>Medication:</strong> ${data.medication || "N/A"}</p>
                    <p><strong>Remarks:</strong> ${data.remarks || "N/A"}</p>
                    <button class="delete-btn" onclick="deleteDisease('${doc.id}')">❌ Delete</button>
                </div>
            `;

            diseaseContainer.appendChild(diseaseCard);
        });
    } catch (error) {
        console.error("❌ Error fetching diseases:", error);
    }
}

// ✅ Function to Delete Disease from Firestore
window.deleteDisease = async function (diseaseId) {
    console.log("🗑 Attempting to delete disease ID:", diseaseId);

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) {
        console.error("❌ No patient selected for deletion.");
        return;
    }

    console.log("✅ Deleting from Patient ID:", patientId);

    const diseaseDoc = doc(db, "patients", patientId, "diseases", diseaseId);

    try {
        // 🔍 Check if document exists before deleting
        const docSnap = await getDoc(diseaseDoc);
        if (!docSnap.exists()) {
            console.warn("⚠ Disease record not found in Firestore.");
            alert("⚠ Disease record not found!");
            return;
        }

        // ✅ Delete the document
        await deleteDoc(diseaseDoc);
        console.log("✅ Disease deleted successfully!");
        alert("✅ Disease deleted successfully!");

        fetchDiseases(); // Refresh list
    } catch (error) {
        console.error("❌ Error deleting disease:", error);
        alert("⚠ Failed to delete disease! See console for details.");
    }
};

// ✅ Load Diseases on Page Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔄 Page loaded. Fetching diseases...");
    fetchDiseases();
});

// ✅ Attach Event Listener for Save Button
document.getElementById("save-btn").addEventListener("click", async function () {
    console.log("🖱 Save button clicked!");
    await saveDisease();
});

//chronic diseases

// ✅ Function to Save Chronic Disease Details to Firestore
let isSavingChronic = false;

async function saveChronicDisease() {
    if (isSavingChronic) return;
    isSavingChronic = true;

    const saveButton = document.querySelector(".save-btnc");
    saveButton.disabled = true;

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) {
        alert("⚠ No patient selected!");
        isSavingChronic = false;
        saveButton.disabled = false;
        return;
    }

    // 📌 Get Form Data
    const chronicDisease = document.getElementById("chronic-disease-select").value.trim();
    const diagnosisDate = document.getElementById("chronic-diagnosis-date").value.trim();
    const currentSymptoms = document.getElementById("chronic-current-symptoms").value.trim();
    const pastSymptoms = document.getElementById("chronic-past-symptoms").value.trim();
    const pastMedications = document.getElementById("previous-medications").value.trim();
    const previousSurgeries = document.getElementById("previous-surgeries").value.trim();
    const previousTherapies = document.getElementById("previous-therapies").value.trim();
    const ongoingMedications = document.getElementById("chronic-current-medications").value.trim();
    const currentTherapy = document.getElementById("chronic-current-therapy").value.trim();
    const doctor = document.getElementById("chronic-doctor").value.trim();
    const remarks = document.getElementById("chronic-remarks").value.trim();

    if (!chronicDisease || !diagnosisDate || !doctor) {
        alert("⚠ Please fill all required fields!");
        isSavingChronic = false;
        saveButton.disabled = false;
        return;
    }

    // 🔥 Save Data
    try {
        const chronicRef = collection(db, "patients", patientId, "chronic-diseases");

        await addDoc(chronicRef, {
            chronicDisease,
            diagnosisDate,
            currentSymptoms,
            pastSymptoms,
            pastMedications,
            previousSurgeries,
            previousTherapies,
            ongoingMedications,
            currentTherapy,
            doctor,
            remarks,
            timestamp: new Date().toISOString()
        });

        console.log("✅ Chronic disease saved successfully!");
        alert("✅ Chronic disease added successfully!");

        fetchChronicDiseases(); // Refresh UI

    } catch (error) {
        console.error("❌ Error saving chronic disease:", error);
        alert("⚠ Failed to save chronic disease! Error: " + error.message);
    }

    isSavingChronic = false;
    saveButton.disabled = false;
}

// ✅ Function to Fetch & Display Chronic Diseases from Firestore
async function fetchChronicDiseases() {
    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) return;

    const chronicRef = collection(db, "patients", patientId, "chronic-diseases");
    const chronicContainer = document.getElementById("chronic-disease-container");
    chronicContainer.innerHTML = ""; // Clear previous data

    try {
        const querySnapshot = await getDocs(chronicRef);

        if (querySnapshot.empty) {
            chronicContainer.innerHTML = "<p>No chronic disease records available</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // ✅ Create a Chronic Disease Card (Non-Collapsible)
            const chronicCard = document.createElement("div");
            chronicCard.classList.add("chronic-card");

            chronicCard.innerHTML = `
                <div class="chronic-header">
                    <strong>${data.chronicDisease || "Unknown Disease"}</strong> 
                </div>
                <div class="chronic-details">
                    <p><strong>Symptoms:</strong> ${data.currentSymptoms || "N/A"}</p>
                    <p><strong>Doctor:</strong> ${data.doctor || "N/A"}</p>
                    <p><strong>Diagnosis Date:</strong> ${data.diagnosisDate || "N/A"}</p>
                    <p><strong>Past Medications:</strong> ${data.pastMedications || "N/A"}</p>
                    <p><strong>Ongoing Medications:</strong> ${data.ongoingMedications || "N/A"}</p>
                    <p><strong>Current Therapy:</strong> ${data.currentTherapy || "N/A"}</p>
                    <p><strong>Previous Surgeries:</strong> ${data.previousSurgeries || "N/A"}</p>
                    <p><strong>Previous Therapies:</strong> ${data.previousTherapies || "N/A"}</p>
                    <p><strong>Remarks:</strong> ${data.remarks || "N/A"}</p>
                    <button class="chronic-delete-btn" onclick="deleteChronicDisease('${doc.id}')">❌ Delete</button>
                </div>
            `;

            chronicContainer.appendChild(chronicCard);
        });
    } catch (error) {
        console.error("❌ Error fetching chronic diseases:", error);
        chronicContainer.innerHTML = "<p>Error fetching records</p>";
    }
}
// ✅ Function to Delete Chronic Disease
window.deleteChronicDisease = async function (chronicId) {
    console.log("🗑 Attempting to delete chronic disease ID:", chronicId);

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) return;

    const chronicDoc = doc(db, "patients", patientId, "chronic-diseases", chronicId);
    try {
        await deleteDoc(chronicDoc);
        console.log("✅ Chronic disease deleted successfully!");
        fetchChronicDiseases(); // Refresh list
    } catch (error) {
        console.error("❌ Error deleting chronic disease:", error);
        alert("⚠ Failed to delete chronic disease!");
    }
};

// ✅ Load Chronic Diseases on Page Load
document.addEventListener("DOMContentLoaded", fetchChronicDiseases);

// ✅ Attach Event Listener for Save Button
document.querySelector(".save-report-btn").addEventListener("click", async function (event) {
    event.preventDefault();
    await saveChronicDisease();
});

// ✅ Initialize Firebase Storage
const storage = getStorage();

// ✅ Select the form
// ✅ Check if the form exists
const labReportForm = document.getElementById("lab-report-form");

if (labReportForm) {
    console.log("✅ Form found!");

    labReportForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent page reload
        console.log("📩 Form submitted!");

        // ✅ Get Form Data
        const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
        console.log("📝 Selected Patient:", selectedPatient);

        const patientId = selectedPatient ? selectedPatient.patientId : null;
        console.log("🆔 Patient ID:", patientId);

        if (!patientId) {
            alert("⚠ No patient selected!");
            return;
        }

        const reportType = document.getElementById("report-type").value.trim();
        const reportDate = document.getElementById("report-date").value;
        const reportFile = document.getElementById("report-file").files[0];

        console.log("📑 Report Type:", reportType);
        console.log("📅 Report Date:", reportDate);
        console.log("📁 Report File:", reportFile);

        if (!reportType || !reportDate || !reportFile) {
            alert("⚠ Please fill all fields and upload a file!");
            return;
        }

        try {
            console.log("📤 Uploading file...");

            // ✅ Upload File to Firebase Storage
            const storageRef = ref(storage, `lab-reports/${patientId}/${reportFile.name}`);
            await uploadBytes(storageRef, reportFile);

            console.log("✅ File uploaded!");

            // ✅ Get File URL
            const fileURL = await getDownloadURL(storageRef);
            console.log("🔗 File URL:", fileURL);

            // ✅ Save to Firestore (inside patient's lab reports)
            const labReportsRef = collection(db, "patients", patientId, "lab-reports");
            await addDoc(labReportsRef, {
                reportType,
                reportDate,
                fileURL,
                timestamp: new Date().toISOString(),
            });

            console.log("✅ Lab report saved successfully!");
            alert("✅ Lab report saved successfully!");

            labReportForm.reset(); // Clear form
            fetchLabReports(); // Refresh reports display
        } catch (error) {
            console.error("❌ Error saving lab report:", error);
            alert("⚠ Failed to save lab report!");
        }
    });
} else {
    console.error("❌ Form not found in DOM!");
}


new Def.Autocompleter.Search('condition',
    'https://clinicaltables.nlm.nih.gov/api/conditions/v3/search');

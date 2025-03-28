import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, doc,updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
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

document.addEventListener("DOMContentLoaded", async function () {
    let foundPatient = localStorage.getItem("selectedPatient");

    if (foundPatient) {
        foundPatient = JSON.parse(foundPatient);
        console.log("Patient Data Found:", foundPatient);

        const patientId = foundPatient.patientId || "N/A";

        // 🔄 Fetch patient image from Firestore
        let profileImageUrl = "https://via.placeholder.com/150"; // Default Placeholder

        if (patientId !== "N/A") {
            try {
                const patientRef = doc(db, "patients", patientId);
                const patientSnap = await getDoc(patientRef);

                if (patientSnap.exists()) {
                    const patientData = patientSnap.data();
                    if (patientData.profileImage) {
                        profileImageUrl = patientData.profileImage; // Use Cloudinary image
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching profile image:", error);
            }
        }

        // 🔄 Update the patient display
        document.getElementById("patient-info").innerHTML = `
            <div class="patient-grid">
                <div><strong>ID:</strong> ${patientId}</div>
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

    const patientImageElement = document.getElementById("patientImage");
        if (foundPatient.profileImage) {
            patientImageElement.src = foundPatient.profileImage;
        } else {
            patientImageElement.src = "https://via.placeholder.com/150"; // Default Image
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
        alert("hello");
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

document.addEventListener("DOMContentLoaded", function () {
    const saveChronicButton = document.getElementById("save-btnc");
    if (saveChronicButton) {
        saveChronicButton.addEventListener("click", async function () {
            await saveChronicDisease();
        });
    } else {
        console.error("❌ Error: Save button not found! Check the ID in HTML.");
    }
});
let isSavingChronic = false; // Prevent multiple submissions

async function saveChronicDisease() {
    if (isSavingChronic) return; // Stop duplicate calls
    isSavingChronic = true;

    const saveChronicButton = document.getElementById("save-btnc");
    saveChronicButton.disabled = true; // Disable button

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) {
        console.error("❌ Error: No patient selected!");
        alert("⚠ No patient selected!");
        isSavingChronic = false;
        saveChronicButton.disabled = false;
        return;
    }

    console.log("✅ Selected Patient ID:", patientId);

    // 📌 Get Form Data
    const chronicDiseaseName = document.getElementById("chronic-disease-select").value.trim();
    const chronicDiseaseDate = document.getElementById("chronic-diagnosis-date").value.trim();
    const chronicSymptoms = document.getElementById("chronic-current-symptoms").value.trim();
    const chronicSurgeries = document.getElementById("chronic-surgeries").value.trim();
    const currentMedications = document.getElementById("chronic-current-medications").value.trim();
    const currentTherapy = document.getElementById("chronic-current-therapy").value.trim();
    const chronicDoctor = document.getElementById("chronic-doctor").value.trim();
    const chronicRemarks = document.getElementById("chronic-remarks").value.trim();

    if (!chronicDiseaseName || !chronicSymptoms || !chronicDoctor) {
        alert("⚠ Please fill all required fields.");
        isSavingChronic = false;
        saveChronicButton.disabled = false;
        return;
    }

    // 🔥 Check if Disease Already Exists for the Patient
    const diseaseRef = collection(db, "patients", patientId, "chronicdiseases");
    
    try {
        const querySnapshot = await getDocs(diseaseRef);
        let isDuplicate = false;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.chronicDiseaseName === chronicDiseaseName && 
                data.chronicDiseaseDate === chronicDiseaseDate &&
                data.chronicDoctor === chronicDoctor) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            alert("⚠ This disease entry already exists for this patient!");
            isSavingChronic = false;
            saveChronicButton.disabled = false;
            return;
        }

        // ✅ Save Data to Firestore
        const docRef = await addDoc(diseaseRef, {
            chronicDiseaseName,
            chronicDiseaseDate,
            chronicSymptoms,
            currentMedications,
            currentTherapy,
            chronicDoctor,
            chronicRemarks,
            chronicSurgeries,
            timestamp: new Date().toISOString(),
        });

        console.log("✅ Chronic Disease saved successfully! Doc ID:", docRef.id);

        // ✅ Clear form correctly
        document.getElementById("chronic-disease-select").value = "";
        document.getElementById("chronic-diagnosis-date").value = "";
        document.getElementById("chronic-current-symptoms").value = "";
        document.getElementById("chronic-surgeries").value = "";
        document.getElementById("chronic-current-medications").value = "";
        document.getElementById("chronic-current-therapy").value = "";
        document.getElementById("chronic-doctor").value = "";
        document.getElementById("chronic-remarks").value = "";

        fetchChronicDiseases();

    } catch (error) {
        console.error("❌ Firestore Error:", error);
        alert("⚠ Failed to save Chronic disease: " + error.message);
    }

    isSavingChronic = false;
    saveChronicButton.disabled = false; // Re-enable button
}

// ✅ Attach Event Listener for Save Button
document.addEventListener("DOMContentLoaded", function () {
    const saveChronicButton = document.getElementById("save-btnc");
    if (saveChronicButton) {
        saveChronicButton.addEventListener("click", async function () {
            console.log("🖱 Save button clicked!");
            await saveChronicDisease();
        });
    } else {
        console.error("❌ Error: Save button not found! Check the ID in HTML.");
    }
});

// ✅ Function to Fetch & Display Diseases from Firestore
async function fetchChronicDiseases() {
    console.log("🔄 Fetching Chronic diseases...");

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) {
        console.error("❌ No patient selected for fetching diseases.");
        return;
    }

    console.log("✅ Fetching diseases for Patient ID:", patientId);

    const diseaseRef = collection(db, "patients", patientId, "chronicdiseases");
    const chronicdiseaseContainer = document.getElementById("chronic-disease-container");

    if (!chronicdiseaseContainer) {
        console.error("❌ Element #chronic-disease-container not found!");
        return;
    }

    chronicdiseaseContainer.innerHTML = ""; // ✅ Clear previous data before adding new cards

    try {
        const querySnapshot = await getDocs(diseaseRef);
        console.log("📜 Total Chronic diseases found:", querySnapshot.size);

        if (querySnapshot.empty) {
            chronicdiseaseContainer.innerHTML = "<p>No records available</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("📌 Disease Data:", data);

            // Create a chronic disease card with collapsible details
            const chronicdiseaseCard = document.createElement("div");
            chronicdiseaseCard.classList.add("chronic-card");

            chronicdiseaseCard.innerHTML = `
                <div class="chronic-header" onclick="toggleDetails(this)">
                    <strong>${data. chronicDiseaseName || "Unknown Disease"}</strong> 
                    
                </div>
                <div class="chronic-details hidden">
                    <p><strong>Symptoms:</strong> ${data.chronicSymptoms || "N/A"}</p>
                    <p><strong>Medication:</strong> ${data.currentMedications || "N/A"}</p>
                    <p><strong>Therapy:</strong> ${data.currentTherapy || "N/A"}</p>
                    <p><strong>Suregry:</strong> ${data.chronicSurgeries || "N/A"}</p>
                    <p><strong>Doctor:</strong> ${data.chronicDoctor || "N/A"}</p>
                    <p><strong>Date:</strong> ${data.chronicDiseaseDate || "N/A"}</p>
                    <p><strong>Remarks:</strong> ${data.chronicRemarks || "N/A"}</p>
                    <button class="delete-btn" onclick="deleteChronicDisease('${doc.id}')">❌ Delete</button>
                </div>
            `;

            chronicdiseaseContainer.appendChild(chronicdiseaseCard);
        });
    } catch (error) {
        console.error("❌ Error fetching diseases:", error);
    }
}

// ✅ Function to Delete Disease from Firestore
window.deleteChronicDisease = async function (chronicdiseaseId) {
    console.log("🗑 Attempting to delete disease ID:", chronicdiseaseId);

    const selectedPatient = JSON.parse(localStorage.getItem("selectedPatient"));
    const patientId = selectedPatient ? selectedPatient.patientId : null;

    if (!patientId) {
        console.error("❌ No patient selected for deletion.");
        return;
    }

    console.log("✅ Deleting from Patient ID:", patientId);

    const chronicdiseaseDoc = doc(db, "patients", patientId, "chronicdiseases", chronicdiseaseId);

    try {
        // 🔍 Check if document exists before deleting
        const docSnap = await getDoc(chronicdiseaseDoc);
        if (!docSnap.exists()) {
            console.warn("⚠ Disease record not found in Firestore.");
            alert("⚠ Disease record not found!");
            return;
        }

        // ✅ Delete the document
        await deleteDoc(chronicdiseaseDoc);
        console.log("✅ Disease deleted successfully!");
        alert("✅ Disease deleted successfully!");

        fetchChronicDiseases(); // Refresh list
    } catch (error) {
        console.error("❌ Error deleting disease:", error);
        alert("⚠ Failed to delete disease! See console for details.");
    }
};

// ✅ Load Chronic Diseases on Page Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔄 Page loaded. Fetching diseases...");
    fetchChronicDiseases();
});

// ✅ Add event listener for form submission
document.getElementById("lab-report-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload
    await uploadLabReport();
});

// ✅ Upload function for Lab Reports
async function uploadLabReport() {
    console.log("📂 Upload function started...");

    // Get input elements
    const fileInput = document.getElementById("report-file");
    const errorElement = document.getElementById("report-error");
    const reportTypeInput = document.getElementById("report-type");
    const reportDateInput = document.getElementById("report-date");

    // Check if elements exist
    if (!fileInput) console.error("❌ report-file is missing in HTML!");
    if (!errorElement) console.error("❌ report-error is missing in HTML!");
    if (!reportTypeInput) console.error("❌ report-type is missing in HTML!");
    if (!reportDateInput) console.error("❌ report-date is missing in HTML!");

    if (!fileInput || !errorElement || !reportTypeInput || !reportDateInput) {
        console.error("❌ Missing required input fields.");
        errorElement.innerText = "❌ All fields are required!";
        return;
    }

    // ✅ Retrieve patient ID from localStorage
    const selectedPatient = localStorage.getItem("selectedPatient");

    if (!selectedPatient) {
        errorElement.innerText = "❌ No patient is selected!";
        console.error("❌ No patient is selected in localStorage!");
        return;
    }

    let patientData;
    try {
        patientData = JSON.parse(selectedPatient);
    } catch (e) {
        console.error("❌ Error parsing patient data:", e);
        errorElement.innerText = "❌ Patient data is corrupted!";
        return;
    }

    // ✅ Extract patientId from localStorage
    const patientId = patientData.patientId;

    if (!patientId || typeof patientId !== "string") {
        errorElement.innerText = "❌ Invalid Patient ID!";
        console.error("❌ Invalid Patient ID:", patientId);
        return;
    }

    console.log("✅ Selected Patient ID:", patientId);

    // Get input values
    const file = fileInput.files[0];
    const reportType = reportTypeInput.value.trim();
    const reportDate = reportDateInput.value.trim();

    // Validation
    if (!file) {
        errorElement.innerText = "❌ Please select a file!";
        return;
    }
    if (!reportType || !reportDate) {
        errorElement.innerText = "❌ Report type and date are required!";
        return;
    }

    try {
        console.log("🔄 Uploading report to Cloudinary...");

        // ✅ Upload file to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "AarogyaLekha");

        const response = await fetch("https://api.cloudinary.com/v1_1/dlapjxix7/image/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Upload failed!");

        const data = await response.json();
        const reportUrl = data.secure_url;

        console.log("✅ Report uploaded successfully:", reportUrl);

        // ✅ Store Report URL in Firebase Firestore
        console.log("🔄 Storing report URL in Firestore...");
        const patientRef = doc(db, "patients", patientId);

        await updateDoc(patientRef, {
            reports: arrayUnion({
                type: reportType,
                date: reportDate,
                url: reportUrl
            })
        });

        console.log("✅ Report URL stored in Firestore!");
        alert("✅ Report upload successful!");
        document.getElementById("lab-report-form").reset();
    } catch (error) {
        console.error("❌ Upload error:", error);
        errorElement.innerText = "❌ Upload failed. Please try again!";
    }
}

export { uploadLabReport };

new Def.Autocompleter.Search('condition',
    'https://clinicaltables.nlm.nih.gov/api/conditions/v3/search');

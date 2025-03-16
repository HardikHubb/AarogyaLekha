

// Existing JavaScript for dropdown functionality remains the same
const profileLogo = document.getElementById('profile-logo');
const dropdownData = document.getElementById('dropdown-data');

// Toggle dropdown visibility when profile logo is clicked
profileLogo.addEventListener('click', function(event) {
    event.stopPropagation();
    const isVisible = dropdownData.style.display === 'block';
    dropdownData.style.display = isVisible ? 'none' : 'block';
});

// Close dropdown when clicking outside
window.addEventListener('click', function(event) {
    if (!event.target.closest('.profile-container')) {
        dropdownData.style.display = 'none';
    }
});

// Dark Mode Toggle Logic
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode'); // Add dark mode to the body
    } else {
        document.body.classList.remove('dark-mode'); // Remove dark mode
    }
});

// Get the button and the language options container
const languageBtn = document.getElementById('language-btn');
const languageOptions = document.getElementById('language-options');

// Add event listener to toggle the dropdown menu
languageBtn.addEventListener('click', function() {
    document.querySelector('.language-container').classList.toggle('active');
});



// Function to Change Text Based on Language Selection
function changeLanguage(language) {
    const welcomeText = document.getElementById('welcome-text');
    const descriptionText = document.getElementById('description');

    if (language === 'english') {
        welcomeText.innerText = 'Welcome to our website!';
        descriptionText.innerText = 'This is a description of the website.';
    } else if (language === 'hindi') {
        welcomeText.innerText = 'हमारी वेबसाइट पर स्वागत है!';
        descriptionText.innerText = 'यह वेबसाइट का विवरण है।';
    } else if (language === 'marathi') {
        welcomeText.innerText = 'आमच्या वेबसाइटवर स्वागत आहे!';
        descriptionText.innerText = 'ही वेबसाइटचा वर्णन आहे.';
    }

    // Animate the content change
    document.getElementById('content').classList.remove('show');
    setTimeout(function() {
        document.getElementById('content').classList.add('show');
    }, 100); // Delay for smooth transition
}


document.addEventListener("DOMContentLoaded", function () {
    const scrollingCards = document.querySelector(".scrolling-cards");

    // Duplicate cards for a seamless infinite loop
    const clone = scrollingCards.cloneNode(true);
    scrollingCards.parentNode.appendChild(clone);
});

function enableEditing() {
    let inputs = document.querySelectorAll(".profile-info input");
    inputs.forEach(input => {
        input.removeAttribute("readonly");
        input.classList.add("editable");
    });

    // Show Save button & Hide Edit button
    document.querySelector(".save-btn").style.display = "block";
    document.querySelector(".edit-btn").style.display = "none";
}

function saveChanges() {
    let inputs = document.querySelectorAll(".profile-info input");
    inputs.forEach(input => {
        input.setAttribute("readonly", true);
        input.classList.remove("editable");
    });

    // Show Edit button & Hide Save button
    document.querySelector(".save-btn").style.display = "none";
    document.querySelector(".edit-btn").style.display = "block";

    alert("Changes saved successfully!");
}

function isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode < 48 || charCode > 57) {
        return false;
    }
    return true;
}

function saveBloodGroup() {
    const bloodGroup = document.getElementById("bloodGroup").value;
    
    if (!bloodGroup) {
        alert("Please select your Blood Group.");
        return;
    }

    // Store in Local Storage (for trial)
    localStorage.setItem("userBloodGroup", bloodGroup);
    alert("Blood Group Saved: " + bloodGroup);
}

// Retrieve stored Blood Group (if exists)
window.onload = function() {
    const storedBloodGroup = localStorage.getItem("userBloodGroup");
    if (storedBloodGroup) {
        document.getElementById("bloodGroup").value = storedBloodGroup;
    }
};


document.addEventListener("DOMContentLoaded", function () {
    const dobInput = document.getElementById("dob");
    const ageInput = document.getElementById("patient-age-input");

    if (!dobInput || !ageInput) {
        console.error("DOB or Age input field not found.");
        return; // Stop execution if elements don't exist
    }

    dobInput.addEventListener("change", function () {
        const dobValue = dobInput.value;
        console.log("Selected DOB:", dobValue); // Debugging

        if (!dobValue) {
            ageInput.value = "";
            return;
        }

        const dob = new Date(dobValue);
        if (isNaN(dob.getTime())) {
            ageInput.value = "";
            return;
        }

        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--; // Adjust age if birthday hasn't occurred yet
        }

        console.log("Calculated Age:", age); // Debugging
        ageInput.value = age >= 0 ? age : "";
    });
});



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {  getFirestore, collection, getDoc,getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsDXa7OmJ2wcpaoV7RRJKBh6ithhABp7o",
    authDomain: "aarogya-lekha.firebaseapp.com",
    projectId: "aarogya-lekha",
    storageBucket: "aarogya-lekha.appspot.com",
    messagingSenderId: "253609387970",
    appId: "1:253609387970:web:66adac86ff86d88853185b",
    measurementId: "G-JH2F1H03S6"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore Database

export { db };  // Export Firestore database




function showPage(pageId) {
    let pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));

    let pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.classList.add("active");
    } else {
        console.error(`Page with ID '${pageId}' not found.`);
    }
}

// ✅ Attach to `window` so it's accessible in HTML
window.showPage = showPage;



// Function to fetch and display hospital name
async function displayHospitalName() {
    const hospitalId = localStorage.getItem("hospitalId"); // Get logged-in hospital ID

    if (!hospitalId) {
        console.error("No hospital ID found. User might not be logged in.");
        document.getElementById("hospital-name").textContent = "Not Logged In";
        return;
    }

    try {
        const hospitalRef = doc(db, "hospitals", hospitalId);
        const hospitalSnap = await getDoc(hospitalRef);

        if (hospitalSnap.exists()) {
            const hospitalData = hospitalSnap.data();
            document.getElementById("hospital-name").textContent = hospitalData.hospitalName; // ✅ Display fetched name
        } else {
            console.warn("Hospital data not found in Firestore.");
            document.getElementById("hospital-name").textContent = "Hospital Not Found";
        }
    } catch (error) {
        console.error("Error fetching hospital data:", error);
        document.getElementById("hospital-name").textContent = "Error Loading Name";
    }
}



// Call function to display hospital name
displayHospitalName();


document.addEventListener("DOMContentLoaded", function () {
    generatePatientID(); 

    document.getElementById("registration-form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form reset before processing

        let patientId = document.getElementById("patient-id-display").value;
        let patientName = document.getElementById("patient-name-input").value.trim();
        let patientAge = document.getElementById("patient-age-input").value.trim();
        let dob = document.getElementById("dob").value.trim();
        let address = document.getElementById("aaddress").value.trim();
        let contact = document.getElementById("patient-number-input").value.trim();
        let secondaryContact = document.getElementById("patient-secondarynumber-input").value.trim();
        let bloodGroup = document.getElementById("bloodGroup").value.trim();
        let gender = document.getElementById("gender").value.trim();

        console.log("Captured Values Before Validation:");
        console.log({ patientId, patientName, patientAge, dob, address, contact, secondaryContact, bloodGroup, gender });

        // Validation before proceeding to Firestore
        if (!patientName || !dob || !contact) {
            alert("Please fill all required fields!");
            return;
        }

        let newPatient = {
            patientId,
            patientName,
            patientAge,
            dob,
            address,
            contact,
            secondaryContact,
            bloodGroup,
            gender
        };

        try {
            await setDoc(doc(db, "patients", patientId), newPatient, { merge: true });
            alert(`Patient Registered Successfully! \nPatient ID: ${patientId}`);

            document.getElementById("registration-form").reset(); // Reset after successful storage
            generatePatientID();
        } catch (error) {
            console.error("Error adding patient to Firestore: ", error);
            alert("Error: " + error.message);
        }
    });
});

// Function to Retrieve Hospital Data
async function fetchHospitalProfile() {
    // Get Hospital ID from Local Storage (saved during login)
    let hospitalId = localStorage.getItem("hospitalId");

    if (!hospitalId) {
        alert("No hospital ID found! Please log in again.");
        window.location.href = "examplelogin.html"; // Redirect to login if no ID is found
        return;
    }

    try {
        // Fetch Hospital Data from Firestore
        const hospitalRef = doc(db, "hospitals", hospitalId);
        const hospitalSnap = await getDoc(hospitalRef);

        if (!hospitalSnap.exists()) {
            alert("Hospital profile not found!");
            return;
        }

        let hospitalData = hospitalSnap.data();

        // Populate Input Fields with Retrieved Data
        document.getElementById("hospitalName").value = hospitalData.hospitalName || "";
        document.getElementById("hospitalID").value = hospitalId; // ID is the document key
        document.getElementById("pemail").value = hospitalData.email || "";
        document.getElementById("pstate").value = hospitalData.state || "";
        document.getElementById("pcity").value = hospitalData.city || "";
        document.getElementById("paddress").value = hospitalData.address || "";

    } catch (error) {
        console.error("Error fetching hospital profile:", error);
        alert("Error fetching profile: " + error.message);
    }
}

// Call Function When Page Loads
document.addEventListener("DOMContentLoaded", fetchHospitalProfile);


// Function to Search Patient by ID
// Function to Search Patient by ID
async function searchPatient(event) {
    event.preventDefault(); // Prevent form from reloading the page

    let patientId = document.getElementById("patient-id-input").value.trim();

    if (!patientId) {
        alert("Please enter a valid Patient ID!");
        return;
    }

    try {
        // Fetch Patient Data from Firestore
        const patientRef = doc(db, "patients", patientId);
        const patientSnap = await getDoc(patientRef);

       

        let patientData = patientSnap.data();
        patientData.patientId = patientId; // Store ID along with data

        // Save Data to Local Storage
        localStorage.setItem("selectedPatient", JSON.stringify(patientData));

        // Redirect to Patient Display Page
        window.location.href = "patient-data-display.html";
    } catch (error) {
        console.error("Error retrieving patient data:", error);
        alert("Error fetching patient data: " + error.message);
    }
}

// Attach event listener
document.getElementById("patient-id-form").addEventListener("submit", searchPatient);

async function generatePatientID() {
    try {
        console.log("Fetching Patient IDs...");

        const patientsCollection = collection(db, "patients");
        const snapshot = await getDocs(patientsCollection);

        let maxId = 0;

        snapshot.forEach((doc) => {
            let docId = parseInt(doc.id, 10); // Convert document ID to a number
            if (!isNaN(docId) && docId > maxId) {
                maxId = docId;
            }
        });

        let newId = (maxId + 1).toString().padStart(10, '0'); // Ensures 10-digit format
        document.getElementById("patient-id-display").value = newId;
        console.log("New Patient ID Generated:", newId);

    } catch (error) {
        console.error("Error generating Patient ID:", error.message);
        alert("Error generating Patient ID: " + error.message);
    }
}


// Show Selected Page
function showPage(pageId) {
    let pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));

    document.getElementById(pageId).classList.add("active");
}
function redirectToPage(page) {
    window.location.href = page;  // Redirects to the specified page
}

// Fetch the hospital name from localStorage
const hospitalName = localStorage.getItem('hospitalName');

// Display the hospital name next to the profile icon if available
if (hospitalName) {
    document.getElementById('hospital-name').textContent = hospitalName;
} else {
    document.getElementById('hospital-name').textContent = 'Hospital Name Not Set';
}

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
    generatePatientID(); // Generate ID when page loads

    document.getElementById("registration-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        let patients = JSON.parse(localStorage.getItem("patientData")) || []; // Fetch existing data

        let patientId = document.getElementById("patient-id-display").value; // Use auto-generated ID
        let patientName = document.getElementById("patient-name-input").value;
        let patientAge = document.getElementById("patient-age-input").value;
        let dob = document.getElementById("dob").value;
        const aaddress = document.getElementById("aaddress").value;
        let contact = document.getElementById("patient-number-input").value;
        let secondaryContact=document.getElementById("patient-secondarynumber-input").value;
        let bloodGroup = document.getElementById("bloodGroup").value;
        let gender = document.getElementById("gender").value;
        let newPatient = {
            patientId,
            patientName,
            patientAge,
            dob,
            aaddress,
            contact,
            bloodGroup,
            secondaryContact,
            gender
        };
        localStorage.setItem("aaddress", aaddress);

        patients.push(newPatient);
        localStorage.setItem("patientData", JSON.stringify(patients));

        alert(`Patient Registered Successfully! \nPatient ID: ${patientId}`);

        document.getElementById("registration-form").reset(); // Clear form fields
        generatePatientID(); // Generate new ID for next patient
    });
});

// **Move Search Event Listener Outside**
document.getElementById("patient-id-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    let searchId = document.getElementById("patient-id-input").value;
    console.log("Searching for Patient ID:", searchId);

    let storedPatients = JSON.parse(localStorage.getItem("patientData")) || [];
    console.log("Stored Patients in LocalStorage:", storedPatients);

    let foundPatient = storedPatients.find(patient => patient.patientId === searchId);

    if (foundPatient) {
        console.log("Patient found!", foundPatient);
        localStorage.setItem("selectedPatient", JSON.stringify(foundPatient));
        window.location.href = "patient-data-display.html"; // Make sure the path is correct

    } else {
        alert("No patient found with this ID!");
    }
});
document.addEventListener("DOMContentLoaded", function () {
    // Load stored data into profile inputs
    document.getElementById("hospitalID").value = localStorage.getItem("hospitalID") || "";
    document.getElementById("hospitalName").value = localStorage.getItem("hospitalName") || "";
    document.getElementById("email").value = localStorage.getItem("email") || "";
    document.getElementById("state").value = localStorage.getItem("state") || "";
    document.getElementById("city").value = localStorage.getItem("city") || "";
    document.getElementById("address").value = localStorage.getItem("address") || "";
});

// Function to generate unique Patient ID
function generatePatientID() {
    let patients = JSON.parse(localStorage.getItem("patientData")) || [];
    
    let newId;
    if (patients.length === 0) {
        newId = "0000000001"; // First ID
    } else {
        let lastId = patients[patients.length - 1].patientId; // Get last stored ID
        newId = (parseInt(lastId) + 1).toString().padStart(10, '0'); // Increment and format
    }

    document.getElementById("patient-id-display").value = newId; // Show in form
}

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

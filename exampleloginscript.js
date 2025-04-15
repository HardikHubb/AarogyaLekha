const signInTab = document.getElementById("sign-in-tab");
const loginTab = document.getElementById("login-tab");
const signInForm = document.getElementById("sign-in-form");
const loginForm = document.getElementById("login-form");

// Add click event listeners
signInTab.addEventListener("click", () => {
    toggleActive(signInTab, loginTab, signInForm, loginForm);
});

loginTab.addEventListener("click", () => {
    toggleActive(loginTab, signInTab, loginForm, signInForm);
});

// Function to toggle active class
function toggleActive(activeTab, inactiveTab, activeForm, inactiveForm) {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    activeForm.classList.add("active-form");
    inactiveForm.classList.remove("active-form");

}


const citiesByState = {
    "andhra_pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool", "Nellore"],
    "arunachal_pradesh": ["Itanagar", "Ziro", "Pasighat", "Tawang", "Daporijo"],
    "assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
    "bihar": ["Patna", "Gaya", "Bhagalpur", "Darbhanga", "Muzaffarpur"],
    "chhattisgarh": ["Raipur", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh"],
    "goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa"],
    "gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhuj"],
    "haryana": ["Chandigarh", "Faridabad", "Gurgaon", "Hisar", "Karnal"],
    "himachal_pradesh": ["Shimla", "Kullu", "Dharamshala", "Solan", "Una"],
    "jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribag"],
    "karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belagavi", "Gulbarga"],
    "kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "madhya_pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    "maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Amravati"],
    "manipur": ["Imphal", "Churachandpur", "Kakching", "Thoubal", "Tamenglong"],
    "meghalaya": ["Shillong", "Tura", "Nongstoin", "Mawkyrwat", "Jowai"],
    "mizoram": ["Aizawl", "Lunglei", "Kolasib", "Saiha", "Serchhip"],
    "nagaland": ["Kohima", "Dimapur", "Mokokchung", "Mon", "Tuensang"],
    "odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    "rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur"],
    "sikkim": ["Gangtok", "Namchi", "Mangan", "Ravangla", "Geyzing"],
    "tamil_nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Adilabad"],
    "tripura": ["Agartala", "Udaipur", "Ambassa", "Belonia", "Khowai"],
    "uttar_pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Allahabad"],
    "uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Almora"],
    "west_bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol"],
    "andaman_nicobar": ["Port Blair", "Diglipur", "Car Nicobar", "Kamorta"],
    "chandigarh": ["Chandigarh"],
    "dadra_nagar_haveli_daman_diu": ["Silvassa", "Daman", "Diu"],
    "delhi": ["New Delhi", "South Delhi", "North Delhi", "West Delhi", "East Delhi"],
    "jammu_kashmir": ["Srinagar", "Jammu"],
    "ladakh": ["Leh", "Kargil"],
    "lakshadweep": ["Kavaratti"],
    "puducherry": ["Pondicherry", "Karaikal", "Mahe", "Yanam"]
};


// Function to update the city dropdown
function updateCityDropdown() {
    const stateSelect = document.getElementById("state");
    const citySelect = document.getElementById("city");
    const selectedState = stateSelect.value;

    // Clear existing city options
    citySelect.innerHTML = '<option value="">Select your city</option>';

    // Enable city dropdown if a valid state is selected
    if (selectedState && citiesByState[selectedState]) {
        citySelect.disabled = false;

        // Populate city dropdown with relevant options
        citiesByState[selectedState].forEach((city) => {
            const option = document.createElement("option");
            option.value = city.toLowerCase().replace(/\s+/g, "_");
            option.textContent = city;
            citySelect.appendChild(option);
        });

    } else {
        citySelect.disabled = true; // Disable if no valid state is selected
    }
}

// Event listener to call the updateCityDropdown function on state change
document.getElementById("state").addEventListener("change", updateCityDropdown);




const translations = {
    en: {
      signup: "SIGN UP",
      login: "LOG IN",
      SIGNUPP:"SIGN UP",
      LOGINN:"LOG IN",
      hid:"Hospital ID",
      hname:"Hospital Name",
      statess:"Select Your State",
      citi:"Select Your City",
      add:"Address",
      usern:"User ID",
      pass:"Password",
      confpass:"Confirm Password",
      sub:"Submit",
      al:"Aarogya Lekha",
      contact:"Contact Us",
      about:"About Us",
      help:"Help"
    },
    hi: {
      signup: "साइन अप करें",
      login: "लॉग इन करें",
      SIGNUPP:"साइन अप",
      LOGINN:"लॉग इन",
      hid:"अस्पताल आईडी:",
      hname:"अस्पताल का नाम:",
      statess:"अपना राज्य चुनें:",
      citi:"अपना शहर चुनें:",
      add:"पता:",
      usern:"उपयोगकर्ता आईडी",
      pass:"पासवर्ड:",
      confpass:"पासवर्ड की पुष्टि करें:",
      sub:"जमा करें",
      al:"आरोग्य लेखा",
      contact:"हमसे संपर्क करें",
      about:"हमारे बारे में",
      help:"सहायता"
      
    },
    mr: {
      signup: "साइन अप करा",
      login: "लॉग इन करा",
      SIGNUPP:"साइन अप",
      LOGINN:"लॉग इन",
      hid:"रुग्णालय आयडी:",
      hname:"रुग्णालयाचे नाव:",
      statess:"तुमचे राज्य निवडा:",
      citi:"तुमचे शहर निवडा:",
      add:"पत्ता:",
      usern:"वापरकर्ता आयडी",
      pass:"पासवर्ड:",
      confpass:"पासवर्डची पुष्टी करा:",
      sub:"सबमिट करा",
      al:"आरोग्य लेखा",
      contact:"आमच्याशी संपर्क साधा",
      about:"आमच्याबद्दल",
      help:"मदत"
    },
  };
  
  // Function to update the page content
  function updateLanguage(lang) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-translate");
      el.textContent = translations[lang][key];
    });
    localStorage.setItem("language", lang); // Save preference
    // Update the language button text
    const langButton = document.querySelector('.dropdown-btn');
    if (lang === 'en') {
      langButton.innerHTML = '🇬🇧 English';
    } else if (lang === 'hi') {
      langButton.innerHTML = '🇮🇳 हिंदी';
    } else if (lang === 'mr') {
      langButton.innerHTML = '🇮🇳 मराठी';
    }
  }
  
  // Initialize the language on page load
  window.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("language") || "en";
    updateLanguage(savedLang);
  });
  
  // Handle language selection changes from the dropdown
  document.querySelectorAll('.dropdown-content a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const lang = event.target.getAttribute('data-lang');
      updateLanguage(lang);
    });
  });
 function openForgotPassword(){
    document.getElementById("forgotPasswordBtn").addEventListener("click", function() {
        window.location.href = "forgot-password.html";
      });
 }

 document.getElementById("signupform").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  let isValid = true;

  // Hospital ID Validation
  const hospitalId = document.getElementById('hospital-id');
  const hospitalIdError = document.getElementById('hospital-id-error');
  if (!hospitalId.checkValidity()) {
      hospitalIdError.textContent = hospitalId.validationMessage;
      isValid = false;
  } else {
      hospitalIdError.textContent = '';
  }

  // Hospital Name Validation
  const hospitalName = document.getElementById('hospital-name');
  const hospitalNameError = document.getElementById('hospital-name-error');
  if (!hospitalName.checkValidity()) {
      hospitalNameError.textContent = hospitalName.validationMessage;
      isValid = false;
  } else {
      hospitalNameError.textContent = '';
  }

  // Email Validation
  const email = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  if (!email.checkValidity()) {
      emailError.textContent = email.validationMessage;
      isValid = false;
  } else {
      emailError.textContent = '';
  }

  // State Validation
  const state = document.getElementById('state');
  const stateError = document.getElementById('state-error');
  if (!state.checkValidity()) {
      stateError.textContent = 'Please select a state.';
      isValid = false;
  } else {
      stateError.textContent = '';
  }

  // Address Validation
  const address = document.getElementById('address');
  const addressError = document.getElementById('address-error');
  if (!address.checkValidity()) {
      addressError.textContent = address.validationMessage;
      isValid = false;
  } else {
      addressError.textContent = '';
  }

  // Password Validation
  const password = document.getElementById('password');
  const passwordError = document.getElementById('password-error');
  if (!password.checkValidity()) {
      passwordError.textContent = password.validationMessage;
      isValid = false;
  } else {
      passwordError.textContent = '';
  }

  // Confirm Password Validation
  const confirmPassword = document.getElementById('confirm-password');
  const confirmPasswordError = document.getElementById('confirm-password-error');
  if (confirmPassword.value !== password.value) {
      confirmPasswordError.textContent = "Passwords do not match.";
      isValid = false;
  } else {
      confirmPasswordError.textContent = '';
  }

  if (isValid) {
      
      this.submit(); // Submit the form if all validations pass
  }
});

document.querySelectorAll('.toggle-icon').forEach(icon => {
  icon.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const passwordField = document.getElementById(targetId);

      if (passwordField.type === "password") {
          passwordField.type = "text"; // Show the password
          this.innerHTML = '<i class="fas fa-eye-slash"></i>'; // Eye slash icon
      } else {
          passwordField.type = "password"; // Hide the password
          this.innerHTML = '<i class="fas fa-eye"></i>'; // Eye icon
      }
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    const navbar = document.querySelector(".navbar");
    const component = document.querySelector(".component");
    const appname = document.querySelector(".app-name");
    const logincontainer = document.querySelector(".login-container");
    const signincontainer = document.querySelector(".login-container");
    const navlink = document.querySelector(".nav-link");
    const navlink1 = document.querySelector(".nav-link1");
    const navlink2 = document.querySelector(".nav-link2");
    const inputss = document.querySelectorAll(".login-container input");
    const eye = document.querySelectorAll(".toggle-icon");

    // Apply saved theme from local storage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark");
        navbar.classList.add("dark");
        component.classList.add("dark");
        themeToggle.classList.add("dark");
        appname.classList.add("dark");
        logincontainer.classList.add("dark");
        logincontainerh2.classList.add("dark");
        signupcontainerh2.classList.add("dark");
        navlink.classList.add("dark");
        navlink1.classList.add("dark");
        navlink2.classList.add("dark");
        inputss.forEach(input => input.classList.add("dark"));
        eye.forEach(input => input.classList.add("dark"));
    }

    // Toggle theme on click
    themeToggle.addEventListener("click", () => {
        const isDark = body.classList.toggle("dark");
        navbar.classList.toggle("dark");
        component.classList.toggle("dark");
        themeToggle.classList.toggle("dark");
        appname.classList.toggle("dark");
        logincontainer.classList.toggle("dark");
        logincontainerh2.classList.toggle("dark");
        signupcontainerh2.classList.toggle("dark");
        navlink.classList.toggle("dark");
        navlink1.classList.toggle("dark");
        navlink2.classList.toggle("dark");
        inputss.forEach(input => input.classList.toggle("dark"));
        eye.forEach(input => input.classList.toggle("dark"));

        // Save theme preference
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
});


function redirectToPage(page) {
    window.location.href = page;  // Redirects to the specified page
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsDXa7OmJ2wcpaoV7RRJKBh6ithhABp7o",
    authDomain: "aarogya-lekha.firebaseapp.com",
    projectId: "aarogya-lekha",
    storageBucket: "aarogya-lekha.firebasestorage.app",
    messagingSenderId: "253609387970",
    appId: "1:253609387970:web:66adac86ff86d88853185b",
    measurementId: "G-JH2F1H03S6"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore Database

// **SIGNUP FUNCTION**
document.getElementById("signupform").addEventListener("submit", async function(event) {
    event.preventDefault();

    let hospitalId = document.getElementById("hospital-id").value;
    let hospitalName = document.getElementById("hospital-name").value;
    let email = document.getElementById("email").value;
    let state = document.getElementById("state").value;
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;
    let password = document.getElementById("password").value;

    try {
        // Store hospital data in Firestore using hospital ID as the document ID
        await setDoc(doc(db, "hospitals", hospitalId), {
            hospitalName,
            email,
            state,
            city,
            address,
            password // Consider hashing the password for security
        });

        alert("Hospital Registered Successfully!");
        document.getElementById("signupform").reset();
    } catch (error) {
        alert("Error: " + error.message);
    }
});

document.getElementById("loginform").addEventListener("submit", async function(event) {
    event.preventDefault();

    let hospitalId = document.getElementById("hospital-id-login").value;
    let password = document.getElementById("login-password").value;

    console.log("Logging in with Hospital ID:", hospitalId);

    try {
        const hospitalRef = doc(db, "hospitals", hospitalId);
        const hospitalSnap = await getDoc(hospitalRef);

        if (!hospitalSnap.exists()) {
            alert("Hospital ID not found!");
            console.log("No document found!");
            return;
        }

        let storedData = hospitalSnap.data();
        console.log("Stored Data:", storedData);

        if (storedData.password !== password) {
            alert("Incorrect password!");
            return;
        }

        
        localStorage.setItem("hospitalId", hospitalId);
        window.location.href = "Homepage.html";

    } catch (error) {
        console.error("Error during login:", error);
        alert("Error: " + error.message);
    }
});

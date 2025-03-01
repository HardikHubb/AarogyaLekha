document.addEventListener("DOMContentLoaded", () => {
  const translations = {
      en: {
          appName: "Aarogya Lekha",
          home: "Home",
          help: "Help",
          forgotPassword: "Forgot Password",
          email: "Email",
          hospitalId: "Hospital ID",
          submit: "Submit",
          language: "English"
      },
      hi: {
        appName: "आरोग्य लेखा",
        home: "होम",
        help: "मदद",
        forgotPassword: "पासवर्ड भूल गए",
        email: "ईमेल",
        hospitalId: "अस्पताल आईडी",
        submit: "जमा करें",
        language: "हिंदी"
        
      },
      mr: {
          appName: "आरोग्य लेखा",
          home: "मुख्य पृष्ठ",
          help: "सहायता",
          forgotPassword: "पासवर्ड विसरला",
          email: "ईमेल",
          hospitalId: "रुग्णालय आयडी",
          submit: "सादर करा",
          language: "मराठी"
      }
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
      const langButton = document.querySelector('.dropdown-btn span');
      langButton.textContent = translations[lang].language;
  }

  // Initialize the language on page load
  const savedLang = localStorage.getItem("language") || "en";
  updateLanguage(savedLang);

  // Handle language selection changes from the dropdown
  document.querySelectorAll('.dropdown-content a').forEach((link) => {
      link.addEventListener('click', (event) => {
          event.preventDefault();
          const lang = event.target.getAttribute('data-lang');
          updateLanguage(lang);
      });
  });

  // Form submission handling
  document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting normally
      
      const email = document.getElementById('email').value;
      const hospitalId = document.getElementById('hospital-id').value;

      // Simulate sending the email and show a message
      if (email && hospitalId) {
          alert('Code is sent to your email!');
          window.location.href = 'examplelogin.html'; // Redirect back to the login page
      } else {
          alert('Please fill in all the required details.');
      }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const appName = document.querySelector(".app-name");
  const navLinks = document.querySelectorAll(".nav-link");
  const forgotPasswordContainer = document.querySelector(".forgot-password-container");
  const inputs = document.querySelectorAll(".forgot-password-container input");
  const button = document.querySelector(".forgot-password-container button");
  const heading = document.querySelector(".forgot-password-container h2");
  const label = document.querySelectorAll(".forgot-password-container label");

  // Apply saved theme from local storage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
      body.classList.add("dark");
      themeToggle.classList.add("dark");
      navbar.classList.add("dark");
      appName.classList.add("dark");
      navLinks.forEach(link => link.classList.add("dark"));
      forgotPasswordContainer.classList.add("dark");
      inputs.forEach(input => input.classList.add("dark"));
      button.classList.add("dark");
     heading.classList.add("dark");
     label.forEach(label => label.classList.add("dark"));
  }

  // Toggle theme on click
  themeToggle.addEventListener("click", () => {
      const isDark = body.classList.toggle("dark");
      body.classList.toggle("dark");
        themeToggle.classList.toggle("dark");
      navbar.classList.toggle("dark");
      appName.classList.toggle("dark");
      navLinks.forEach(link => link.classList.toggle("dark"));
      forgotPasswordContainer.classList.toggle("dark");
      inputs.forEach(input => input.classList.toggle("dark"));
      button.classList.toggle("dark");
      heading.classList.toggle("dark");
      label.forEach(label => label.classList.toggle("dark"));

      // Save theme preference
      localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS Public Key

    // Load hospital data from localStorage
    const hospitalDataString = localStorage.getItem("hospitalData");
    if (!hospitalDataString) {
        console.error("Hospital data not found in LocalStorage!");
        alert("Error: No hospital data available. Try again later.");
        return;
    }

    const hospitalData = JSON.parse(hospitalDataString);
    console.log("Loaded Hospital Data:", hospitalData); // Debugging

    document.getElementById("forgotPasswordForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("email").value.trim();
        const hospitalIdInput = document.getElementById("hospital-id").value.trim();

        if (!emailInput || !hospitalIdInput) {
            alert("Please enter both Email and Hospital ID.");
            return;
        }

        console.log("Searching for hospital ID:", hospitalIdInput);

        const hospital = hospitalData.find(hosp => hosp.hospitalId === hospitalIdInput);

        if (!hospital) {
            alert("Hospital ID not found!");
            console.log("Hospital ID not in JSON.");
            return;
        }

        if (hospital.email !== emailInput) {
            alert("Email does not match our records!");
            return;
        }

        console.log("User Verified. Sending Email...");
        const userPassword = hospital.password;

        const templateParams = {
            email: emailInput,
            hospital_id: hospitalIdInput,
            password: userPassword
        };

        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
            .then(response => {
                alert("Your password has been sent to your email!");
                console.log("Email Sent:", response);
            })
            .catch(error => {
                alert("Error sending email. Please try again later.");
                console.error("EmailJS Error:", error);
            });
    });
});

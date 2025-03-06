// Toggle Sidebar Open/Close
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let content = document.getElementById("main-content"); // Ensure this is the correct ID
    sidebar.classList.toggle("collapsed");
    content.classList.toggle("collapsed"); // Ensure this is toggled
}

// Call this function when you want to toggle the sidebar
document.getElementById("toggle-button").addEventListener("click", toggleSidebar);


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

// Language Options
document.getElementById('english-option').addEventListener('click', function() {
    changeLanguage('english');
});
document.getElementById('hindi-option').addEventListener('click', function() {
    changeLanguage('hindi');
});
document.getElementById('marathi-option').addEventListener('click', function() {
    changeLanguage('marathi');
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

    // OPTIONAL: Store in localStorage (for persistence)
    localStorage.setItem("hospitalName", document.getElementById("hospitalName").value);
    localStorage.setItem("hospitalID", document.getElementById("hospitalID").value);
    localStorage.setItem("email", document.getElementById("email").value);
    localStorage.setItem("state", document.getElementById("state").value);
    localStorage.setItem("city", document.getElementById("city").value);
    localStorage.setItem("address", document.getElementById("address").value);
    localStorage.setItem("userID", document.getElementById("userID").value);

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

const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');

// Handle image selection
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = function() {
            const base64Image = reader.result;
            localStorage.setItem('storedImage', base64Image); // Store in Local Storage
            previewImage.src = base64Image;
            previewImage.style.display = 'block';
        };
    }
});

document.getElementById("imageInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById("previewImage");
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});


// Select tabs and forms
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

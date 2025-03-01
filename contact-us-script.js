function toggleDarkMode() {
    // Toggle the 'dark' class on the body
    document.body.classList.toggle('dark');

    // Toggle the 'dark' class on the navbar
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('dark');

    // Toggle the 'dark' class on the theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.classList.toggle('dark');

    // Toggle the 'dark' class on the outside container
    const outsideContainer = document.querySelector('.outside-container');
    outsideContainer.classList.toggle('dark');

    // Toggle the 'dark' class on the inside container
    const insidecontainer = document.querySelectorAll('.inside-container');
    insidecontainer.forEach(link => {
        link.classList.toggle('dark');
    });

    // Toggle the 'dark' class on the app name
    const appName = document.querySelector('.app-name');
    appName.classList.toggle('dark');

    // Toggle the 'dark' class on the nav links
    const navLinks = document.querySelectorAll('.nav-link1, .nav-link2');
    navLinks.forEach(link => {
        link.classList.toggle('dark');
    });

    // Toggle the 'dark' class on the dropdown button
    const dropdownBtn = document.querySelector('.dropdown-btn');
    dropdownBtn.classList.toggle('dark');

    // Toggle the 'dark' class on the dropdown content
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.classList.toggle('dark');
}

// Add event listener to the theme toggle button
document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
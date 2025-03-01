const translations = {
    en: {
        al: "Aarogya Lekha",
        home: "Home",
        contact: "Contact Us",
        about: "About Us",
        faqTitle: "Frequently Asked Questions",
        q1: "How do I log in to my account?",
        a1: "Enter your Hospital ID and password on the login page. If you forget your password, use the 'Forgot Password' option.",
        q2: "Is my data secure on Aarogya Lekha?",
        a2: "Yes, we use strong encryption and security measures to protect your data from unauthorized access.",
        q3: "What should I do if I face technical issues?",
        a3: "Try refreshing the page or clearing your browser cache. If the problem persists, contact our support team.",
        q4: "Why is my login not working?",
        a4: "Check if your Hospital ID and password are correct. If the issue persists, try resetting your password.",
        moreQuestions: "Have more questions?",
        textareaPlaceholder: "Type your question here...",
        submit: "Submit"
    },
    hi: {
        al: "आरोग्य लेखा",
        home: "मुख्य पृष्ठ",
        contact: "संपर्क करें",
        about: "हमारे बारे में",
        faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
        q1: "मैं अपने खाते में कैसे लॉग इन करूं?",
        a1: "लॉगिन पृष्ठ पर अपना अस्पताल आईडी और पासवर्ड दर्ज करें। यदि आप अपना पासवर्ड भूल गए हैं, तो 'पासवर्ड भूल गए' विकल्प का उपयोग करें।",
        q2: "क्या मेरा डेटा आरोग्य लेखा पर सुरक्षित है?",
        a2: "हाँ, हम आपकी डेटा को अवैध पहुँच से बचाने के लिए मजबूत एन्क्रिप्शन और सुरक्षा उपायों का उपयोग करते हैं।",
        q3: "यदि मुझे तकनीकी समस्याएँ हों तो क्या करें?",
        a3: "पृष्ठ को पुनः लोड करें या अपने ब्राउज़र का कैश साफ़ करें। यदि समस्या बनी रहती है, तो हमारी सहायता टीम से संपर्क करें।",
        q4: "मेरा लॉगिन क्यों काम नहीं कर रहा?",
        a4: "जांचें कि आपका अस्पताल आईडी और पासवर्ड सही हैं। यदि समस्या बनी रहती है, तो अपना पासवर्ड रीसेट करने का प्रयास करें।",
        moreQuestions: "और प्रश्न हैं?",
        textareaPlaceholder: "यहां अपना प्रश्न टाइप करें...",
        submit: "जमा करें"
    },
    mr: {
        al: "आरोग्य लेखा",
        home: "मुख्यपृष्ठ",
        contact: "संपर्क",
        about: "आमच्याबद्दल",
        faqTitle: "सामान्य प्रश्न",
        q1: "मी माझ्या खात्यात कसे लॉगिन करू?",
        a1: "लॉगिन पृष्ठावर तुमचा हॉस्पिटल आयडी आणि पासवर्ड टाका. पासवर्ड विसरलात का? 'पासवर्ड विसरला' पर्याय वापरा.",
        q2: "माझा डेटा आरोग्य लेखावर सुरक्षित आहे का?",
        a2: "होय, आम्ही बळकट एन्क्रिप्शन आणि सुरक्षा उपायांचा वापर करून तुमचा डेटा संरक्षित करतो.",
        q3: "मला तांत्रिक समस्या आल्यास काय करावे?",
        a3: "पृष्ठ रीफ्रेश करा किंवा ब्राउझर कॅशे साफ करा. समस्या कायम राहिल्यास आमच्या सपोर्ट टीमशी संपर्क साधा.",
        q4: "माझे लॉगिन का चालत नाही?",
        a4: "तुमचा हॉस्पिटल आयडी आणि पासवर्ड बरोबर आहे का ते तपासा. समस्या असल्यास, पासवर्ड रीसेट करा.",
        moreQuestions: "अजून प्रश्न आहेत?",
        textareaPlaceholder: "येथे तुमचा प्रश्न लिहा...",
        submit: "सबमिट करा"
    }
};

// Function to change the language
function changeLanguage(lang) {
    if (!translations[lang]) return; // Prevent errors if lang is invalid

    // Update all elements with `data-translate`
    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // **Explicitly update FAQ Title & More Questions**
    const faqTitle = document.querySelector("[data-translate='faqTitle']");
    if (faqTitle) faqTitle.innerText = translations[lang].faqTitle;

    const moreQuestions = document.querySelector("[data-translate='moreQuestions']");
    if (moreQuestions) moreQuestions.innerText = translations[lang].moreQuestions;

    // **Update textarea placeholder**
    const textarea = document.querySelector("textarea");
    if (textarea) {
        textarea.placeholder = translations[lang].textareaPlaceholder;
    }

    // **Update the selected language button text**
    const selectedLangText = document.querySelector(`[data-lang='${lang}']`).innerHTML;
    document.getElementById("selected-language").innerHTML = selectedLangText;
}

// Event Listener for Language Dropdown
document.querySelectorAll(".dropdown-content a").forEach(item => {
    item.addEventListener("click", function (event) {
        event.preventDefault();
        const lang = this.getAttribute("data-lang");
        changeLanguage(lang);
    });
});
function toggleAnswer(questionElement) {
    const answerElement = questionElement.nextElementSibling;
    const plusSign = questionElement.querySelector('.plus');

    // Get all FAQ items
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allPlusSigns = document.querySelectorAll('.plus');

    // Close all other answers
    allAnswers.forEach(answer => {
        if (answer !== answerElement) {
            answer.style.display = "none";
        }
    });

    // Reset all plus signs
    allPlusSigns.forEach(sign => {
        sign.textContent = "+";
    });

    // Toggle the clicked answer
    if (answerElement.style.display === "block") {
        answerElement.style.display = "none";
        plusSign.textContent = "+";
    } else {
        answerElement.style.display = "block";
        plusSign.textContent = "-";
    }
}function toggleDarkMode() {
    document.body.classList.toggle('dark');
    document.querySelector('.navbar').classList.toggle('dark');
    document.getElementById('themeToggle').classList.toggle('dark');
    document.querySelector('.outside-container').classList.toggle('dark');

    document.querySelectorAll('.inside-container').forEach(link => {
        link.classList.toggle('dark');
    });

    document.querySelector('.app-name').classList.toggle('dark');
    document.querySelectorAll('.nav-link1, .nav-link2').forEach(link => {
        link.classList.toggle('dark');
    });

    document.querySelector('.dropdown-btn').classList.toggle('dark');
    document.querySelector('.dropdown-content').classList.toggle('dark');
}

// Add event listener to the theme toggle button
document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
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
    localStorage.setItem("theme", isDark ? "dark" : "light");document.getElementById('themeToggle').addEventListener('click', function () {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
      
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    
});
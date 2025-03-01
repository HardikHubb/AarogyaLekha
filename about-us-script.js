
document.addEventListener("DOMContentLoaded", function () {
    const translations = {
        en: {
            al: "Aarogya Lekha",
            about: "Home",
            contact: "Contact Us",
            help: "Help",
            dropdown: "🇬🇧 English",
            heading: "About Us",
            description: "AarogyaLekha is a comprehensive medical records platform designed to securely store and manage patient health information. This platform provides a centralized repository for critical medical data, including surgical history, chronic conditions, and treatment plans. By streamlining access to patient records, AarogyaLekha aims to improve healthcare efficiency and patient care.",
            whatwedo: "What we do?",
            howwework: "Aarogya Lekha is a hospital-patient-based system that assigns a unique patient ID to every individual, allowing them to store and manage medical records centrally. This ensures that:<br>✔ No more lost medical records when switching hospitals,<br>✔ Quick and secure access to medical history during emergencies,<br>✔ Seamless data integration between healthcare providers.",
            ouraim: "Our Aim",
            aimdesc: "At Aarogya Lekha, we aim to revolutionize healthcare management by providing a centralized and secure platform for storing and accessing patient medical records. Our goal is to eliminate data fragmentation, ensuring seamless healthcare experiences for both patients and hospitals.",
            whoarewe: "Who are we?",
            whodesc: "Aarogya Lekha is a college project developed by a dedicated group of students with a shared vision of improving healthcare management through technology. Our goal is to create a centralized and secure system that allows patients and hospitals to seamlessly store, access, and manage medical records."
        },
        hi: {
            al: "आरोग्य लेखा",
            about: "होम",
            contact: "संपर्क करें",
            help: "मदद",
            dropdown: "🇮🇳 हिंदी",
            heading: "हमारे बारे में",
            description: "आरोग्य लेखा एक व्यापक चिकित्सा रिकॉर्ड प्लेटफार्म है जिसे रोगी स्वास्थ्य जानकारी को सुरक्षित रूप से संग्रहीत और प्रबंधित करने के लिए डिज़ाइन किया गया है। यह प्लेटफार्म महत्वपूर्ण चिकित्सा डेटा जैसे शल्य चिकित्सा इतिहास, पुरानी स्थितियाँ और उपचार योजनाओं के लिए एक केंद्रीकृत भंडार प्रदान करता है। रोगी रिकॉर्ड तक पहुंच को सुव्यवस्थित करके, आरोग्य लेखा स्वास्थ्य सेवा दक्षता और रोगी देखभाल में सुधार करना चाहता है।",
            whatwedo: "हम क्या करते हैं?",
            howwework: "आरोग्य लेखा एक अस्पताल-रोगी आधारित प्रणाली है जो प्रत्येक व्यक्ति को एक अद्वितीय रोगी आईडी सौंपती है, जिससे वे मेडिकल रिकॉर्ड को केंद्रीकृत रूप से संग्रहीत और प्रबंधित कर सकते हैं। यह सुनिश्चित करता है कि:<br>✔ अस्पताल बदलने पर कोई मेडिकल रिकॉर्ड खो न जाए,<br>✔ आपातकाल के दौरान मेडिकल इतिहास तक त्वरित और सुरक्षित पहुंच,<br>✔ स्वास्थ्य सेवा प्रदाताओं के बीच सहज डेटा एकीकरण।",
            ouraim: "हमारा उद्देश्य",
            aimdesc: "आरोग्य लेखा में, हमारा लक्ष्य एक केंद्रीकृत और सुरक्षित मंच प्रदान करके स्वास्थ्य देखभाल प्रबंधन में क्रांति लाना है। हमारा उद्देश्य डेटा विभाजन को समाप्त करना और मरीजों और अस्पतालों के लिए सहज स्वास्थ्य देखभाल अनुभव सुनिश्चित करना है।",
            whoarewe: "हम कौन हैं?",
            whodesc: "आरोग्य लेखा एक कॉलेज प्रोजेक्ट है जिसे छात्रों के एक समर्पित समूह द्वारा विकसित किया गया है, जिसका उद्देश्य प्रौद्योगिकी के माध्यम से स्वास्थ्य देखभाल प्रबंधन में सुधार करना है। हमारा लक्ष्य एक केंद्रीकृत और सुरक्षित प्रणाली बनाना है जो मरीजों और अस्पतालों को मेडिकल रिकॉर्ड को आसानी से संग्रहीत, एक्सेस और प्रबंधित करने की अनुमति देती है।"
        },
        mr: {
            al: "आरोग्य लेखा",
            about: "मुख्यपृष्ठ",
            contact: "संपर्क करा",
            help: "मदत",
            dropdown: "🇮🇳 मराठी",
            heading: "आमच्याबद्दल",
            description: "आरोग्य लेखा ही एक व्यापक वैद्यकीय नोंदणी प्रणाली आहे, जी रुग्णांची आरोग्य माहिती सुरक्षितपणे संग्रहित आणि व्यवस्थापित करण्यासाठी डिझाइन केली आहे. ही प्रणाली महत्वपूर्ण वैद्यकीय डेटा जसे की शस्त्रक्रिया इतिहास, जुनाट स्थिती आणि उपचार योजना यासाठी एक केंद्रीकृत भांडार प्रदान करते. आरोग्य सेवा कार्यक्षमतेत सुधारणा करण्यासाठी आणि रुग्णांची काळजी वाढवण्यासाठी आरोग्य लेखा कार्यरत आहे.",
            whatwedo: "आम्ही काय करतो?",
            howwework: "आरोग्य लेखा ही एक रुग्णालय-रुग्ण आधारित प्रणाली आहे जी प्रत्येक व्यक्तीला एक अनन्य रुग्ण आयडी प्रदान करते, त्यामुळे ते त्यांच्या वैद्यकीय नोंदी केंद्रीकृत स्वरूपात संग्रहित आणि व्यवस्थापित करू शकतात. हे सुनिश्चित करते की:<br>✔ रुग्णालय बदलताना वैद्यकीय नोंदी गमावल्या जाणार नाहीत,<br>✔ आपत्कालीन परिस्थितीत वैद्यकीय इतिहासाची त्वरित आणि सुरक्षित प्रवेश,<br>✔ आरोग्य सेवा प्रदात्यांमध्ये अखंड डेटा एकीकरण।",
            ouraim: "आमचे ध्येय",
            aimdesc: "आरोग्य लेखा मध्ये, आम्ही आरोग्य सेवा व्यवस्थापनात क्रांती घडवण्याचे लक्ष्य ठेवतो, एक केंद्रीकृत आणि सुरक्षित प्लॅटफॉर्म प्रदान करून. आमचे ध्येय डेटा विभागणी समाप्त करणे आणि रुग्ण आणि रुग्णालयांसाठी अखंड आरोग्य सेवा अनुभव सुनिश्चित करणे आहे.",
            whoarewe: "आम्ही कोण आहोत?",
            whodesc: "आरोग्य लेखा हा एक कॉलेज प्रोजेक्ट आहे जो तंत्रज्ञानाद्वारे आरोग्य सेवा व्यवस्थापन सुधारण्याच्या दृष्टीकोनातून विद्यार्थ्यांच्या एका समर्पित गटाने विकसित केला आहे. आमचे ध्येय एक केंद्रीकृत आणि सुरक्षित प्रणाली तयार करणे आहे जी रुग्ण आणि रुग्णालयांना वैद्यकीय नोंदी सहज संग्रहित, प्रवेश आणि व्यवस्थापित करण्याची परवानगी देते."
        }
    };

    function changeLanguage(lang) {
        document.querySelector("[data-translate='al']").textContent = translations[lang].al;
        document.querySelector("[data-translate='about']").textContent = translations[lang].about;
        document.querySelector("[data-translate='contact']").textContent = translations[lang].contact;
        document.querySelector("[data-translate='help']").textContent = translations[lang].help;
        document.querySelector(".dropdown-btn").textContent = translations[lang].dropdown;

        document.querySelector("h1").textContent = translations[lang].heading;
        document.querySelector("p").innerHTML = translations[lang].description;
        document.querySelector(".aboutuscontainer h2").textContent = translations[lang].whatwedo;
        document.querySelector(".aboutuscontainer p").innerHTML = translations[lang].howwework;
        document.querySelectorAll(".aboutuscontainer1 h2")[0].textContent = translations[lang].ouraim;
        document.querySelectorAll(".aboutuscontainer1 p")[0].textContent = translations[lang].aimdesc;
        document.querySelectorAll(".aboutuscontainer1 h2")[1].textContent = translations[lang].whoarewe;
        document.querySelectorAll(".aboutuscontainer1 p")[1].textContent = translations[lang].whodesc;
    }

    document.querySelectorAll(".dropdown-content a").forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            const selectedLang = this.getAttribute("data-lang");
            changeLanguage(selectedLang);
        });
    });
});
// Function to toggle dark mode
function toggleDarkMode() {
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

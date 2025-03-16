document.addEventListener("DOMContentLoaded", function () {
    // Retrieve Patient Data from Local Storage
    let foundPatient = JSON.parse(localStorage.getItem("selectedPatient"));

    if (foundPatient) {
        document.getElementById("patient-info").innerHTML = `
            <div class="patient-grid">
                <div><strong>ID:</strong> ${foundPatient.patientId}</div>
                <div><strong>Name:</strong> ${foundPatient.patientName}</div>
                <div><strong>Age:</strong> ${foundPatient.patientAge}</div>
                <div><strong>DOB:</strong> ${foundPatient.dob}</div>
                <div><strong>Address:</strong> ${foundPatient.address}</div>
                <div><strong>Contact:</strong> ${foundPatient.contact}</div>
                <div><strong>Secondary Contact:</strong> ${foundPatient.secondaryContact}</div>
                <div><strong>Blood Group:</strong> ${foundPatient.bloodGroup}</div>
                <div><strong>Gender:</strong> ${foundPatient.gender}</div>
            </div>
        `;
    } else {
        document.getElementById("patient-info").innerHTML = "<p>No patient data found!</p>";
    }
});



// Function to delete a disease record
function deleteDisease(index) {
    let diseases = JSON.parse(localStorage.getItem("diseases")) || [];

    if (confirm("Are you sure you want to delete this record?")) {
        diseases.splice(index, 1); // Remove the selected entry
        localStorage.setItem("diseases", JSON.stringify(diseases)); // Update local storage
        loadDiseaseData(); // Reload table
    }
}

// Load disease data on page load
document.addEventListener("DOMContentLoaded", loadDiseaseData);



document.addEventListener("DOMContentLoaded", function () {
    loadLabReports(); // Load existing lab reports when the page loads

    document.getElementById("lab-report-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let reports = JSON.parse(localStorage.getItem("labReports")) || [];

        let reportType = document.getElementById("report-type").value;
        let reportDate = document.getElementById("report-date").value;
        let reportFile = document.getElementById("report-file").files[0];

        if (!reportFile) {
            alert("Please upload a file.");
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(reportFile); // Convert file to Base64
        reader.onload = function () {
            let newReport = {
                id: Date.now(),
                type: reportType,
                date: reportDate,
                fileData: reader.result // Store Base64-encoded file
            };

            reports.push(newReport);
            localStorage.setItem("labReports", JSON.stringify(reports));

            alert("Lab report saved successfully!");
            document.getElementById("lab-report-form").reset();
            loadLabReports();
        };
    });
});

// Function to Load Lab Reports
function loadLabReports() {
    let reportList = document.getElementById("lab-report-list");
    let reports = JSON.parse(localStorage.getItem("labReports")) || [];

    if (reports.length === 0) {
        reportList.innerHTML = "<tr><td colspan='5'>No reports available</td></tr>";
        return;
    }

    reportList.innerHTML = reports.map((report, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${report.type}</td>
            <td>${report.date}</td>
            <td><button onclick="viewReport('${report.fileData}')">View</button></td>
            <td><button onclick="deleteReport(${report.id})">🗑️Delete</button></td>
        </tr>
    `).join("");
}

// Function to View Report
function viewReport(fileData) {
    let newWindow = window.open();
    newWindow.document.write(`<iframe src="${fileData}" width="100%" height="100%"></iframe>`);
}

// Function to Delete Report
function deleteReport(id) {
    let reports = JSON.parse(localStorage.getItem("labReports")) || [];
    reports = reports.filter(report => report.id !== id);
    localStorage.setItem("labReports", JSON.stringify(reports));
    loadLabReports();
}

// Function to View Report in a Modal
function viewReport(fileData) {
    let modal = document.getElementById("report-modal");
    let iframe = document.getElementById("report-viewer");

    if (fileData) {
        iframe.src = fileData; // Load report inside iframe
        modal.style.display = "flex"; // Show modal
    } else {
        alert("No report available!");
    }
}

// Function to Close Modal
function closeModal() {
    document.getElementById("report-modal").style.display = "none";
}

// Prevent the modal from opening on page load
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("report-modal").style.display = "none";
});

document.addEventListener("DOMContentLoaded", function () {
    // Smooth Scrolling for Navbar Links
    const navbarLinks = document.querySelectorAll(".tabs button");

    navbarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 40,
                    behavior: "smooth"
                });
            }
        });
    });
});



function openTab(event, tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
        tab.style.display = "none";
    });

    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    const activeTab = document.getElementById(tabId);
    activeTab.classList.add("active");
    activeTab.style.display = "block";

    event.currentTarget.classList.add("active");

    // 🔴 Hide Disease Section (h3 + table) if not "Medical History" tab
    const diseaseSection = document.querySelector("#disease-table").closest(".table-container").previousElementSibling;
    const diseaseTable = document.getElementById("disease-table").closest(".table-container");

    if (tabId === "medical-history") {
        if (diseaseSection) diseaseSection.style.display = "block";
        if (diseaseTable) diseaseTable.style.display = "block";
    } else {
        if (diseaseSection) diseaseSection.style.display = "none";
        if (diseaseTable) diseaseTable.style.display = "none";
    }
}
   
document.addEventListener("DOMContentLoaded", function () {
    loadChronicDiseaseData();

    document .getElementById("chronic-disease-form").addEventListener("submit", function (event) {
        event.preventDefault(); // ✅ Prevent page reload

        // Get input values
        const chronicdiseaseName = document.getElementById("chronic-disease-select").value;
        const chronicsymptoms = document.getElementById("chronic-current-symptoms").value;
        const chronicdate = document.getElementById("chronic-diagnosis-date").value;
        const chronicdoctor = document.getElementById("chronic-doctor").value;
        const chronicpmedication = document.getElementById("previous-medications").value;
        const chroniccmedication = document.getElementById("chronic-current-medications").value;
        const chronicctherapy = document.getElementById("chronic-current-therapy").value;
        const chronicpsurgery = document.getElementById("previous-surgeries").value;
        const chronicptherapy = document.getElementById("previous-therapies").value;
        const chronicremarks = document.getElementById("chronic-remarks").value;

        // Get existing data from localStorage
        let chronicdiseases = JSON.parse(localStorage.getItem("chronic-diseases")) || [];

        // Add new disease entry
        chronicdiseases.push({
            chronicdiseaseName,
            chronicsymptoms,
            chronicdoctor,
            chronicdate,
            chronicpmedication,
            chroniccmedication,
            chronicctherapy,
            chronicpsurgery,
            chronicptherapy,
            chronicremarks
        });

        // Save to localStorage
        localStorage.setItem("chronic-diseases", JSON.stringify(chronicdiseases));

        // Refresh table
        loadChronicDiseaseData();

        // ✅ Clear form inputs for next entry
        document.getElementById("chronic-disease-form").reset();
    });
});

// ✅ Function to load chronic disease history in table format
function loadChronicDiseaseData() {
    const chronicdiseaseList = document.getElementById("chronic-disease-list");
    let chronicdiseases = JSON.parse(localStorage.getItem("chronic-diseases")) || [];

    if (chronicdiseases.length === 0) {
        chronicdiseaseList.innerHTML = "<tr><td colspan='11'>No records available</td></tr>";
        return;
    }

    chronicdiseaseList.innerHTML = chronicdiseases.map((chronicdisease, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${chronicdisease.chronicdiseaseName}</td>
            <td>${chronicdisease.chronicsymptoms}</td>
            <td>${chronicdisease.chronicdoctor}</td>
            <td>${chronicdisease.chronicdate}</td>
            <td>${chronicdisease.chronicpmedication}</td>
            <td>${chronicdisease.chroniccmedication}</td>
            <td>${chronicdisease.chronicctherapy}</td>
            <td>${chronicdisease.chronicpsurgery}</td>
            <td>${chronicdisease.chronicptherapy}</td>
            <td>${chronicdisease.chronicremarks}</td>
            <td>
                <button class="delete-btn" onclick="deleteChronicDisease(${index})">🗑️ Delete</button>
            </td>
        </tr>
    `).join("");
}
// Function to delete a chronic disease entry
function deleteChronicDisease(index) {
    let chronicdiseases = JSON.parse(localStorage.getItem("chronic-diseases")) || [];

    if (index >= 0 && index < chronicdiseases.length) {
        // Remove the selected disease from the array
        chronicdiseases.splice(index, 1);

        // Save the updated array back to localStorage
        localStorage.setItem("chronic-diseases", JSON.stringify(chronicdiseases));

        // Refresh the table
        loadChronicDiseaseData();
    }
}

// Function to load disease history with color-coded categories
function loadDiseaseData() {
    const diseaseList = document.getElementById("disease-list");
    let diseases = JSON.parse(localStorage.getItem("diseases")) || [];

    if (diseases.length === 0) {
        diseaseList.innerHTML = "<tr><td colspan='8'>No records available</td></tr>";
        return;
    }

    diseaseList.innerHTML = diseases.map((disease, index) => {
        let rowColor = "";
        switch (disease.diseaseCategory) {
            case "Chronic Diseases":
                rowColor = "#ADD8E6"; // Light blue
                break;
            case "Critical Diseases":
                rowColor = "#FF7F7F"; // Light red
                break;
            case "Moderate Diseases":
                rowColor = "#FFFF99"; // Light yellow
                break;
            case "Normal Diseases":
                rowColor = "white"; // Normal white
                break;
        }

        return `
            <tr style="background-color: ${rowColor};">
                <td>${index + 1}</td>
                <td>${disease.diseaseName.replace(/_/g, " ")}</td>
                <td>${disease.symptoms || "N/A"}</td>
                <td>${disease.doctor || "N/A"}</td>
                <td>${disease.admitDate || "N/A"}</td>
                <td>${disease.medication || "N/A"}</td>
                <td>${disease.remarks || "N/A"}</td>
                <td>
                    <button class="delete-btn" onclick="deleteDisease(${index})">🗑️ Delete</button>
                </td>
            </tr>
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", function () {
    loadDiseaseData(); // ✅ This function loads disease data once the page is ready

    const diseaseForm = document.getElementById("disease-form");
    if (!diseaseForm) {
        console.error("❌ Form with ID 'disease-form' not found!");
        return; // Stop execution if form does not exist
    }

    diseaseForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        const diseaseSelect = document.getElementById("disease-list1");
        if (!diseaseSelect) {
            console.error("❌ Disease select dropdown not found!");
            return;
        }

        const diseaseName = diseaseSelect.value;
        const symptoms = document.getElementById("symptoms")?.value || "N/A";
        const doctor = document.getElementById("doctor")?.value || "N/A";
        const admitDate = document.getElementById("admit-date")?.value || "N/A";
        const medication = document.getElementById("medication")?.value || "N/A";
        const remarks = document.getElementById("remarks")?.value || "N/A";

        // Disease category mapping
        const diseaseCategories = {
            "diabetes": "Chronic Diseases",
            "hypertension": "Chronic Diseases",
            "asthma": "Chronic Diseases",
            "arthritis": "Chronic Diseases",
            "chronic_kidney_disease": "Chronic Diseases",
            "cancer": "Critical Diseases",
            "heart_attack": "Critical Diseases",
            "stroke": "Critical Diseases",
            "liver_failure": "Critical Diseases",
            "sepsis": "Critical Diseases",
            "pneumonia": "Moderate Diseases",
            "dengue": "Moderate Diseases",
            "malaria": "Moderate Diseases",
            "typhoid": "Moderate Diseases",
            "tuberculosis": "Moderate Diseases",
            "common_cold": "Normal Diseases",
            "flu": "Normal Diseases",
            "allergy": "Normal Diseases",
            "food_poisoning": "Normal Diseases",
            "skin_rash": "Normal Diseases"
        };

        const diseaseCategory = diseaseCategories[diseaseName] || "Unknown";

        let diseases = JSON.parse(localStorage.getItem("diseases")) || [];

        diseases.push({
            name: diseaseName, // ✅ Fixed key to "name" instead of "diseaseName"
            category: diseaseCategory,
            symptoms,
            doctor,
            admitDate,
            medication,
            remarks
        });

        localStorage.setItem("diseases", JSON.stringify(diseases));

        loadDiseaseData(); // Reload data after saving
        diseaseForm.reset(); // Reset the form
    });

}); // ✅ Correctly closes the outer event listener

    

    function printReport() {
        const printContent = document.getElementById("printable-content");
        
        if (!printContent) {
            alert("Error: Printable content not found!");
            return;
        }
    
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        
        window.print();
        
        // Restore original content after printing
        window.location.reload();
    }
    
    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const printableContent = document.getElementById("printable-content");
    
        html2canvas(printableContent).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 10, 10, 190, 0);
            doc.save("Patient_Report.pdf");
        });
    }
    
    function loadPrintData() {
        document.getElementById("print-name").innerText = document.getElementById("patient-name").innerText;
        document.getElementById("print-id").innerText = document.getElementById("patient-id").innerText;
        document.getElementById("print-age").innerText = document.getElementById("patient-age").innerText;
        document.getElementById("print-gender").innerText = document.getElementById("patient-gender").innerText;
    
        const diseaseList = document.getElementById("print-disease-list");
        let diseases = JSON.parse(localStorage.getItem("diseases")) || [];
    
        console.log("Retrieved Diseases:", diseases); // ✅ Debugging Log
    
        diseaseList.innerHTML = diseases.length === 0 
            ? "<tr><td colspan='7'>No records available</td></tr>" 
            : diseases.map((disease, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${disease.name}</td>
                    <td>${disease.symptoms}</td>
                    <td>${disease.doctor}</td>
                    <td>${disease.admitDate}</td>  <!-- ✅ Fixed Date Key -->
                    <td>${disease.medication}</td>
                    <td>${disease.remarks}</td>
                </tr>
            `).join("");
    
        const chronicList = document.getElementById("print-chronic-list");
        let chronicDiseases = JSON.parse(localStorage.getItem("chronic-diseases")) || [];
    
        console.log("Retrieved Chronic Diseases:", chronicDiseases); // ✅ Debugging Log
    
        chronicList.innerHTML = chronicDiseases.length === 0 
            ? "<tr><td colspan='7'>No records available</td></tr>" 
            : chronicDiseases.map((disease, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${disease.name}</td>  <!-- ✅ Standardized Key -->
                    <td>${disease.symptoms}</td>
                    <td>${disease.doctor}</td>
                    <td>${disease.admitDate}</td>
                    <td>${disease.medication}</td>
                    <td>${disease.remarks}</td>
                </tr>
            `).join("");
    }
    
    // ✅ Load data when page is ready
    window.addEventListener("load", loadPrintData);
    
    
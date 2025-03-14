document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the selected patient from Local Storage
    let foundPatient = JSON.parse(localStorage.getItem("selectedPatient"));

    if (foundPatient) {
        // Display the patient details in a grid format
        document.getElementById("patient-info").innerHTML = `
            <div class="patient-grid">
                <div><strong>ID:</strong> ${foundPatient.patientId}</div>
                <div><strong>Name:</strong> ${foundPatient.patientName}</div>
                <div><strong>Age:</strong> ${foundPatient.patientAge}</div>
                <div><strong>DOB:</strong> ${foundPatient.dob}</div>
                <div><strong>Address:</strong> ${foundPatient.aaddress}</div>
                
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
document.addEventListener("DOMContentLoaded", function (){
    document.getElementById("aaddress").value = localStorage.getItem("aaddress") || "";
});

document.addEventListener("DOMContentLoaded", function () {
    loadDiseaseData();

    document.getElementById("disease-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        // Get input values
        const diseaseName = document.getElementById("disease-name").value;
        const symptoms = document.getElementById("symptoms").value;
        const doctor = document.getElementById("doctor").value;
        const admitDate = document.getElementById("admit-date").value;
        const medication = document.getElementById("medication").value;
        const remarks = document.getElementById("remarks").value;


        // Get existing data from localStorage
        let diseases = JSON.parse(localStorage.getItem("diseases")) || [];

        // Add new disease entry
        diseases.push({
            diseaseName,
            symptoms,
            doctor,
            admitDate,
            medication,
            remarks
        });

        // Save to localStorage
        localStorage.setItem("diseases", JSON.stringify(diseases));

        // Refresh table
        loadDiseaseData();

        // Clear form inputs for next entry
        document.getElementById("disease-form").reset();
    });
});

// Function to load disease history in table format
function loadDiseaseData() {
    const diseaseList = document.getElementById("disease-list");
    let diseases = JSON.parse(localStorage.getItem("diseases")) || [];

    if (diseases.length === 0) {
        diseaseList.innerHTML = "<tr><td colspan='8'>No records available</td></tr>";
        return;
    }

    diseaseList.innerHTML = diseases.map((disease, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${disease.diseaseName}</td>
            <td>${disease.symptoms}</td>
            <td>${disease.doctor}</td>
            <td>${disease.admitDate}</td>
            <td>${disease.medication}</td>
            <td>${disease.remarks}</td>
            <td>
                <button class="delete-btn" onclick="deleteDisease(${index})">🗑️ Delete</button>
            </td>
        </tr>
    `).join("");
}

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


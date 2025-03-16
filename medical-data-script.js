
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



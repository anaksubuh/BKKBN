const GITHUB_TOKEN = "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";
const GITHUB_USERNAME = "anaksubuh";
const REPO_NAME = "bkkbn.github.io";
const FILE_PATH = "data.json";
const BRANCH_NAME = "main";

const dataForm = document.getElementById("data-form");
const dataTable = document.getElementById("data-table").querySelector("tbody");

// Function to calculate age
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Fetch existing data
async function fetchData() {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`
    }
  });
  const data = await response.json();
  const content = JSON.parse(atob(data.content));
  return content;
}

// Update data on GitHub
async function updateData(newData) {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;
  const existingData = await fetchData();
  const updatedData = [...existingData, newData];
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update data",
      content: btoa(JSON.stringify(updatedData)),
      sha: existingData.sha,
      branch: BRANCH_NAME
    })
  });
  return response.json();
}

// Add form submission logic
dataForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newData = {
    kelurahan: document.getElementById("kelurahan").value,
    rt: document.getElementById("rt").value,
    rw: document.getElementById("rw").value,
    namaSuami: document.getElementById("nama-suami").value,
    nikSuami: document.getElementById("nik-suami").value,
    namaIstri: document.getElementById("nama-istri").value,
    nikIstri: document.getElementById("nik-istri").value,
    tanggalLahir: document.getElementById("tanggal-lahir").value,
    umurIstri: calculateAge(document.getElementById("tanggal-lahir").value),
    jumlahAnak: document.getElementById("jumlah-anak").value,
    statusKb: document.getElementById("status-kb").value,
    bulan: document.getElementById("bulan").value
  };
  await updateData(newData);
  alert("Data berhasil disimpan!");
});

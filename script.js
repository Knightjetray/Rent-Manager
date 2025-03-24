// Replace these with your actual values
// Ensure 'spreadsheetId' is declared only once in the script
if (typeof spreadsheetId === "undefined") {
  var spreadsheetId = "1LsvdvD6AeYnxdXax7WvlzuttQtV58i1OJbx_JF0nc7g"; // e.g., "1aBcDeFgHiJk"
}
const apiKey = "AIzaSyCM9FZdh2oPykcdkWoVzuAsnQchONkDJHM"; // e.g., "AIzaSy..."
const sheetName = "Rent Overview";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:G100?key=${apiKey}`;


let allData = []; // Store all rows for filtering

// Fetch data from Google Sheets
function fetchRentData() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      allData = data.values;
      displayData(allData);
      calculateTotalRent(allData);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      alert("Failed to load rent data. Check your API key and spreadsheet settings.");
    });
}

// Display data in the table
function displayData(rows) {
  const table = document.getElementById("rentTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Clear existing content
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Headers
  const headers = rows[0];
  const headerRow = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Data rows (skip header row)
  const dataRows = rows.slice(1);
  dataRows.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    // Highlight overdue rows
    if (row[5] === "Overdue") {
      tr.classList.add("overdue");
    }
    tbody.appendChild(tr);
  });
}

// Calculate and display total rent
function calculateTotalRent(rows) {
  const dataRows = rows.slice(1); // Skip header
  const total = dataRows.reduce((sum, row) => {
    const rent = parseFloat(row[3].replace("$", "").replace(",", "")) || 0;
    return sum + rent;
  }, 0);
  document.getElementById("totalRent").textContent = `$${total.toLocaleString()}`;
}

// Filter for overdue payments
document.getElementById("showOverdue").addEventListener("click", () => {
  const overdueRows = [allData[0], ...allData.slice(1).filter(row => row[5] === "Overdue")];
  displayData(overdueRows);
  calculateTotalRent(overdueRows);
});

// Show all data
document.getElementById("showAll").addEventListener("click", () => {
  displayData(allData);
  calculateTotalRent(allData);
});

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredRows = [allData[0], ...allData.slice(1).filter(row => 
    row.some(cell => cell.toLowerCase().includes(searchTerm))
  )];
  displayData(filteredRows);
  calculateTotalRent(filteredRows);
});

// Load data on page load
window.onload = fetchRentData;
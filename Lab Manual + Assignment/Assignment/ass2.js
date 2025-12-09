// API: CoinGecko (No API key needed)
const API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr&include_24hr_change=true";

const priceEl = document.getElementById("price");
const changeEl = document.getElementById("change");
const refreshBtn = document.getElementById("refreshBtn");

// Chart Data Arrays
let chartLabels = [];
let chartData = [];

// Initialize Chart.js
const ctx = document.getElementById("priceChart").getContext("2d");
const priceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: chartLabels,
    datasets: [{
      label: "BTC to INR",
      data: chartData,
      borderWidth: 2,
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: false }
    }
  }
});

// Fetch Price Function
async function fetchPrice() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    const price = data.bitcoin.inr;
    const change = data.bitcoin.inr_24h_change;
    const time = new Date().toLocaleTimeString();

    // Update UI
    priceEl.textContent = "₹" + price.toLocaleString();
    changeEl.textContent = change.toFixed(2) + "%";

    // Color based on price movement
    changeEl.style.color = change > 0 ? "lightgreen" : "red";

    // Update Chart
    chartLabels.push(time);
    chartData.push(price);

    priceChart.update();

  } catch (err) {
    console.log("Error:", err);
  }
}

// Manual Refresh Button
refreshBtn.addEventListener("click", fetchPrice);

// Auto reload every 5 seconds
setInterval(fetchPrice, 5000);

// Initial call
fetchPrice();

const startInput = document.getElementById('start');
const endInput = document.getElementById('end');
const filterBtn = document.getElementById('filterBtn');

const dailyCtx = document.getElementById('dailySalesChart').getContext('2d');
const topCtx = document.getElementById('topProductsChart').getContext('2d');

let dailyChart, topChart;

const BASE_URL = 'http://localhost:3001/api';

// Fetch daily sales
async function fetchDailySales(start, end) {
  const res = await fetch(`${BASE_URL}/sales/daily?start=${start}&end=${end}`);
  return res.json();
}

// Fetch top products
async function fetchTopProducts() {
  const res = await fetch(`${BASE_URL}/sales/top-products`);
  return res.json();
}

// Render daily sales chart
function renderDailySales(data) {
  const labels = data.map(d => d.date);
  const values = data.map(d => parseInt(d.total_sales));

  if (dailyChart) dailyChart.destroy();

  dailyChart = new Chart(dailyCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sales',
        data: values,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'teal',
        fill: true,
      }],
    },
  });
}

// Render top products chart
function renderTopProducts(data) {
  const labels = data.map(p => p.name);
  const values = data.map(p => parseInt(p.total_sold));

  if (topChart) topChart.destroy();

  topChart = new Chart(topCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Quantity Sold',
        data: values,
        backgroundColor: 'orange',
      }],
    },
  });
}

// Main filter function
async function applyFilter() {
  const start = startInput.value;
  const end = endInput.value;
  if (!start || !end) return alert('Please select both dates.');

  const daily = await fetchDailySales(start, end);
  renderDailySales(daily);

  const top = await fetchTopProducts();
  renderTopProducts(top);
}

// Initial load
filterBtn.addEventListener('click', applyFilter);

// Added theme toggle functionality and chart rendering logic

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.querySelector('.theme-toggle');
    const body = document.body;

    // Theme toggle logic
    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
    });

    // Chart.js setup
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const productsCtx = document.getElementById('productsChart').getContext('2d');

    // Line chart for daily sales
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Daily Sales',
                data: [120, 150, 180, 200, 170, 190, 220],
                borderColor: '#007bff',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                }
            }
        }
    });

    // Bar chart for top 5 trending products
    new Chart(productsCtx, {
        type: 'bar',
        data: {
            labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
            datasets: [{
                label: 'Trending Products',
                data: [50, 70, 90, 60, 80],
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                }
            }
        }
    });
});

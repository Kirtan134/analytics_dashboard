document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const startInput = document.getElementById('start');
    const endInput = document.getElementById('end');
    const filterBtn = document.getElementById('filterBtn');
    const themeToggleButton = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Chart contexts and instances
    const dailyCtx = document.getElementById('dailySalesChart').getContext('2d');
    const topCtx = document.getElementById('topProductsChart').getContext('2d');
    let dailyChart, topChart;
    
    const BASE_URL = 'http://localhost:3001/api';
    
    // Set default date range (last 7 days)
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    
    startInput.value = formatDate(weekAgo);
    endInput.value = formatDate(today);
    
    // Format date to YYYY-MM-DD
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    // Theme toggle logic
    themeToggleButton.addEventListener('click', () => body.classList.toggle('dark-mode'));
    
    // Generic fetch function
    async function fetchData(endpoint, params) {
        try {
            const url = `${BASE_URL}/${endpoint}?start=${params.start}&end=${params.end}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
            return res.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    }
    
    // Chart configuration factory
    function createChartConfig(type, labels, values, options = {}) {
        return {
            type,
            data: {
                labels,
                datasets: [{
                    label: options.label || 'Data',
                    data: values,
                    backgroundColor: options.bgColor || 'rgba(33, 226, 226, 0.4)',
                    borderColor: options.borderColor,
                    fill: options.fill
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: options.yLabel || 'Value' }
                    },
                    x: {
                        title: { display: true, text: options.xLabel || 'Category' }
                    }
                }
            }
        };
    }
    
    // Render or update chart
    function renderChart(chartInstance, ctx, type, data, options = {}) {
        const labels = type === 'line' 
            ? data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
            : data.map(p => p.name);
            
        const values = type === 'line'
            ? data.map(d => parseInt(d.total_sales))
            : data.map(p => parseInt(p.total_sold));
            
        const config = createChartConfig(type, labels, values, options);
        
        if (chartInstance) {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = values;
            chartInstance.update();
            return chartInstance;
        }
        
        return new Chart(ctx, config);
    }
    
    // Apply filter function
    async function applyFilter() {
        const start = startInput.value;
        const end = endInput.value;
        
        if (!start || !end) {
            alert('Please select both start and end dates.');
            return;
        }
        
        try {
            // Show loading state
            filterBtn.disabled = true;
            filterBtn.textContent = 'Loading...';
            
            // Fetch data in parallel
            const [dailySalesData, topProductsData] = await Promise.all([
                fetchData('sales/daily', {start, end}),
                fetchData('sales/top-products', {start, end})
            ]);
            
            // Render data
            dailyChart = renderChart(dailyChart, dailyCtx, 'line', dailySalesData, {
                label: 'Sales',
                bgColor: 'rgba(33, 226, 226, 0.4)',
                borderColor: 'teal',
                fill: true,
                xLabel: 'Date', 
                yLabel: 'Quantity Sold'
            });
            
            topChart = renderChart(topChart, topCtx, 'bar', topProductsData, {
                label: 'Quantity Sold',
                bgColor: 'orange',
                xLabel: 'Product', 
                yLabel: 'Quantity Sold'
            });
            
        } catch (error) {
            console.error('Error applying filter:', error);
            alert('An error occurred while updating the dashboard.');
        } finally {
            // Reset button state
            filterBtn.disabled = false;
            filterBtn.textContent = 'Filter';
        }
    }
    
    // Event listeners
    filterBtn.addEventListener('click', applyFilter);
    
    // Initial load with default date range
    applyFilter();
});

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

// Register all the necessary components for a line chart
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

function ProfitLossChart({ chartData, title }) {
  // Options to create a cleaner, more beautiful chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for custom height
    plugins: {
      legend: {
        display: false, // Hide the legend label for a cleaner look
      },
      title: {
        display: true,
        text: title,
        color: '#E5E7EB', // Lighter gray for text
        font: {
          size: 18,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.8)', // Dark background for tooltip
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context) {
            return `Profit/Loss: ₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF' }, // Medium gray for axis labels
        grid: { color: 'rgba(255, 255, 255, 0.05)' }, // Very faint grid lines
      },
      y: { 
        ticks: { 
          color: '#9CA3AF', 
          callback: value => '₹' + value.toLocaleString('en-IN') 
        }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg h-96"> {/* Set a fixed height */}
      <Line options={options} data={chartData} />
    </div>
  );
}

export default ProfitLossChart;
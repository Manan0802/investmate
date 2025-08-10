// --- Imports ---
// Imports the Pie chart component from the react-chartjs-2 library.
import { Pie } from 'react-chartjs-2';
// Imports necessary components from Chart.js to register them.
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// --- Chart.js Registration ---
// This is a required step to make the Pie chart and its features (like tooltips and legends) work.
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * PortfolioChart Component
 * A reusable component that renders a Pie chart for portfolio allocation.
 * @param {object} props - The component's props.
 * @param {object} props.chartData - The data object formatted for Chart.js.
 */
function PortfolioChart({ chartData }) {
  // --- Chart.js Options ---
  // This object customizes the appearance and behavior of the chart.
  const options = {
    // Ensures the chart resizes to fit its container.
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the container's height and width.
    plugins: {
      legend: {
        // Positions the legend at the top of the chart.
        position: 'top',
        labels: {
          // Sets the color of the legend text to be readable on a dark background.
          color: '#d1d5db', // slate-300
          font: {
            size: 12,
          }
        },
      },
      tooltip: {
        // Customizes the pop-up tooltips that appear on hover.
        backgroundColor: '#1f2937', // slate-800
        titleColor: '#ffffff',
        bodyColor: '#d1d5db',
        borderColor: '#334155', // slate-700
        borderWidth: 1,
      },
    },
  };

  return (
    // --- Chart Container ---
    // The component is now transparent, allowing the parent card to define the background.
    // It's set to fill the available height and width of its parent.
    <div className="w-full h-full min-h-[300px]">
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default PortfolioChart;

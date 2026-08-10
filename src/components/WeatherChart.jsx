import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the Chart.js engine elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const WeatherChart = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        // Fetch 24-hour forecast for Delhi
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&hourly=temperature_2m&forecast_days=1';
        const response = await fetch(url);
        const data = await response.json();

        // Format timestamps (e.g., "14:00")
        const labels = data.hourly.time.map(timeStr => {
          const date = new Date(timeStr);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const temperatures = data.hourly.temperature_2m;

        // Configure the dataset for Chart.js
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: temperatures,
              borderColor: '#8b5cf6', // Tailwind violet-500
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderWidth: 3,
              tension: 0.4, // Makes the line curved and smooth
              fill: true,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#8b5cf6',
              pointRadius: 4,
            },
          ],
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Chart Error:", error);
        setIsLoading(false);
      }
    };

    fetchHourlyData();
  }, []);

  // Make the chart look clean and remove grid lines
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 14 },
      },
    },
    scales: {
      y: { grid: { display: true, color: '#f1f5f9' }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: 8 } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">24-Hour Temperature Trend</h3>
      <div className="flex-1 relative w-full h-full">
        {isLoading || !chartData ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl mr-3"></i>
            <span className="font-medium">Loading Analytics...</span>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default WeatherChart;
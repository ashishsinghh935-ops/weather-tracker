import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeroCard from './components/HeroCard';
import WeatherChart from './components/WeatherChart';
import WeatherMap from './components/WeatherMap';

function App() {
  // 1. Set up our React State to hold the live data
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch data when the engine boots up
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Open-Meteo API using coordinates for Delhi
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code';
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Save the live data into our React State
        setCurrentWeather(data.current);
        setIsLoading(false);
      } catch (error) {
        console.error("Engine Error: Failed to fetch weather data", error);
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, []); // The empty array means this only runs ONCE when the app loads

  return (
    <div className="flex w-screen h-screen bg-slate-50 overflow-hidden text-slate-800">
      
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Delhi, India</h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLoading ? "Establishing satellite connection..." : "Live Weather & Analytics"}
            </p>
          </div>
        </header>
        
        {/* 3. Pass the live data into our HeroCard component */}
        <HeroCard data={currentWeather} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <WeatherChart />
          <WeatherMap />
        </div>
        
      </main>
    </div>
  );
}

export default App;
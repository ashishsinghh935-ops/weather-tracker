import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Component Imports
import Sidebar from './components/Sidebar';
import HeroCard from './components/Herocard'; 
import WeatherChart from './components/WeatherChart';
import WeeklyForecast from './components/WeeklyForecast';
import WeatherMap from './components/WeatherMap';
import AirQualityCard from './components/AirQualityCard';
import MapView from './components/MapView';

const App = () => {
  const [location, setLocation] = useState({
    lat: 28.6139,
    lon: 77.2090,
    name: "Delhi, India"
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Centralized API Fetching
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Comprehensive API fetch to ensure no component is starved of data
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&current_weather=true&hourly=temperature_2m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 font-sans">
      
      <Sidebar setLocation={setLocation} />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <Routes>
          
          <Route path="/" element={
            <div className="max-w-6xl mx-auto space-y-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500 animate-pulse">Running atmospheric analysis...</p>
                </div>
              ) : (
                <>
                  {/* Passing the full location object to ALL components to stop the undefined 'lat' crashes */}
                  <HeroCard weatherData={weatherData} locationName={location.name} location={location} />
                  
                  <WeatherChart hourlyData={weatherData?.hourly} location={location} />
                  
                  <WeeklyForecast dailyData={weatherData?.daily} location={location} />
                  
                  <WeatherMap location={location} />
                  
                  <AirQualityCard location={location} />
                </>
              )}
            </div>
          } />

          <Route path="/map" element={
            <MapView location={location} setLocation={setLocation} />
          } />
          
        </Routes>
      </div>
    </div>
  );
};

export default App;
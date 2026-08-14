import React, { useState, useEffect, useRef } from 'react';
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

  // Algorithmic LRU Cache using a Map inside a Ref
  const weatherCache = useRef(new Map());
  const CACHE_LIMIT = 5;

  useEffect(() => {
    const fetchWeather = async () => {
      const cacheKey = `${location.lat.toFixed(2)},${location.lon.toFixed(2)}`;

      if (weatherCache.current.has(cacheKey)) {
        console.log(`⚡ Cache Hit for ${location.name}. Loading instantly from memory.`);
        const cachedData = weatherCache.current.get(cacheKey);
        
        weatherCache.current.delete(cacheKey);
        weatherCache.current.set(cacheKey, cachedData);
        
        setWeatherData(cachedData);
        setLoading(false);
        return; 
      }

      console.log(`🌐 Cache Miss for ${location.name}. Fetching fresh API data.`);
      setLoading(true);
      
      try {
        // Fetching real-world wind direction for the canvas vectors
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&current_weather=true&hourly=temperature_2m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await response.json();
        
        if (weatherCache.current.size >= CACHE_LIMIT) {
          const oldestKey = weatherCache.current.keys().next().value;
          weatherCache.current.delete(oldestKey);
          console.log(`🗑️ Cache full. Evicted oldest entry: ${oldestKey}`);
        }

        weatherCache.current.set(cacheKey, data);
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
            <MapView location={location} setLocation={setLocation} weatherData={weatherData} />
          } />
          
        </Routes>
      </div>
    </div>
  );
};

export default App;
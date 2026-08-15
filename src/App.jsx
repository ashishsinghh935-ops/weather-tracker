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
import DashboardSkeleton from './components/DashboardSkeleton';

const App = () => {
  // 1. LAZY INITIALIZATION: Check localStorage first, otherwise fallback to default
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem('weatherpro_user_location');
    if (savedLocation) {
      return JSON.parse(savedLocation);
    }
    return {
      lat: 28.6139,
      lon: 77.2090,
      name: "Delhi, India"
    };
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const weatherCache = useRef(new Map());
  const CACHE_LIMIT = 5;

  // 2. PERSISTENCE EFFECT: Save to localStorage every time the user searches a new city
  useEffect(() => {
    localStorage.setItem('weatherpro_user_location', JSON.stringify(location));
  }, [location]);

  // 3. WEATHER API EFFECT: Fetches Open-Meteo data and manages the LRU Cache
  useEffect(() => {
    const fetchWeather = async () => {
      const cacheKey = `${location.lat.toFixed(2)},${location.lon.toFixed(2)}`;

      if (weatherCache.current.has(cacheKey)) {
        const cachedData = weatherCache.current.get(cacheKey);
        weatherCache.current.delete(cacheKey);
        weatherCache.current.set(cacheKey, cachedData);
        
        setWeatherData(cachedData);
        setLoading(false);
        return; 
      }

      setLoading(true);
      
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day&current_weather=true&hourly=temperature_2m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const data = await response.json();
        
        if (weatherCache.current.size >= CACHE_LIMIT) {
          const oldestKey = weatherCache.current.keys().next().value;
          weatherCache.current.delete(oldestKey);
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

  // Determine if it is currently day or night from Open-Meteo's current_weather payload (1 = day, 0 = night)
  const isDay = weatherData?.current?.is_day ?? weatherData?.current_weather?.is_day ?? 1;

  return (
    // Dynamic Root Background Theme mapping to Day or Night state
    <div className={`flex h-screen font-sans transition-colors duration-500 ${
      isDay ? 'bg-gray-100 text-gray-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      <Sidebar setLocation={setLocation} isDay={isDay} />

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <Routes>
          
          <Route path="/" element={
            <div className="max-w-6xl mx-auto space-y-6">
              {loading ? (
                <DashboardSkeleton />
              ) : (
                <>
                  <HeroCard weatherData={weatherData} locationName={location.name} location={location} isDay={isDay} />
                  <WeatherChart hourlyData={weatherData?.hourly} location={location} isDay={isDay} />
                  <WeeklyForecast dailyData={weatherData?.daily} location={location} isDay={isDay} />
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
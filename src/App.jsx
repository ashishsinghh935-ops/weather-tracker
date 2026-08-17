import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HeroCard from './components/Herocard'; 
import WeatherChart from './components/WeatherChart';
import WeeklyForecast from './components/WeeklyForecast';
import WeatherMap from './components/WeatherMap';
import AirQualityCard from './components/AirQualityCard';
import MapView from './components/MapView';
import DashboardSkeleton from './components/DashboardSkeleton';
import AmbientBackground from './components/AmbientBackground'; // NEW: Import Ambient Engine

const App = () => {
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem('weatherpro_user_location');
    return savedLocation ? JSON.parse(savedLocation) : { lat: 28.6139, lon: 77.2090, name: "Delhi, India" };
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const weatherCache = useRef(new Map());
  const CACHE_LIMIT = 5;

  useEffect(() => {
    localStorage.setItem('weatherpro_user_location', JSON.stringify(location));
  }, [location]);

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
        if (weatherCache.current.size >= CACHE_LIMIT) weatherCache.current.delete(weatherCache.current.keys().next().value);
        weatherCache.current.set(cacheKey, data);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [location]);

  const isDay = weatherData?.current?.is_day ?? weatherData?.current_weather?.is_day ?? 1;
  const weatherCode = weatherData?.current?.weather_code ?? weatherData?.current_weather?.weathercode ?? 0;

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-1000 relative ${
      isDay ? 'bg-gray-50 text-gray-900' : 'bg-zinc-950 text-zinc-100'
    }`}>
      
      {/* 🚀 NEW: The Ambient Background Layer */}
      <AmbientBackground weatherCode={weatherCode} isDay={isDay} />

      <div className="md:hidden absolute top-0 left-0 w-full z-40 flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-gray-200/20">
        <div className="font-bold text-lg tracking-wide">WeatherPro</div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg bg-indigo-500 text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <Sidebar setLocation={setLocation} isDay={isDay} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Added relative z-10 so the content sits ABOVE the ambient weather */}
      <div className="flex-1 overflow-y-auto p-4 pt-20 md:pt-8 md:p-8 relative z-10">
        <Routes>
          <Route path="/" element={
            <div className="max-w-6xl mx-auto space-y-6">
              {loading ? <DashboardSkeleton /> : (
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
          <Route path="/map" element={<MapView location={location} setLocation={setLocation} weatherData={weatherData} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
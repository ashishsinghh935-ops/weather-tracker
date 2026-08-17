import React from 'react';
import { motion } from 'framer-motion';

const getWeatherCondition = (code) => {
  if (code === 0) return { icon: '☀️', text: 'Clear' };
  if (code >= 1 && code <= 3) return { icon: '⛅', text: 'Cloudy' };
  if (code >= 45 && code <= 48) return { icon: '🌫️', text: 'Foggy' };
  if (code >= 51 && code <= 67) return { icon: '🌧️', text: 'Rain' };
  if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Snow' };
  if (code >= 95) return { icon: '⛈️', text: 'Storm' };
  return { icon: '🌡️', text: 'Unknown' };
};

const HeroCard = ({ weatherData, locationName }) => {
  if (!weatherData) return null;

  const temp = weatherData?.current?.temperature_2m ?? weatherData?.current_weather?.temperature;
  const humidity = weatherData?.current?.relative_humidity_2m ?? "--";
  const wind = weatherData?.current?.wind_speed_10m ?? weatherData?.current_weather?.windspeed ?? "--";
  const weatherCode = weatherData?.current?.weather_code ?? weatherData?.current_weather?.weathercode ?? 0;
  
  const condition = getWeatherCondition(weatherCode);

  return (
    <motion.div 
      // 1. SPRING PHYSICS ENTRANCE ANIMATION
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: 0.1 
      }}
      // 2. TACTILE HOVER EFFECT
      whileHover={{ 
        scale: 1.02,
        y: -5,
        boxShadow: "0px 20px 40px rgba(0,0,0,0.2)"
      }}
      className="w-full relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 backdrop-blur-xl bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-fuchsia-500/90 cursor-default"
    >
      
      <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-40 h-40 md:w-64 md:h-64 bg-white/20 rounded-full blur-2xl md:blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 md:-bottom-24 md:-left-24 w-32 h-32 md:w-48 md:h-48 bg-indigo-300/20 rounded-full blur-xl md:blur-2xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/10 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-6">
        <div className="flex flex-col items-center md:items-start w-full">
          
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-sm font-bold tracking-widest uppercase text-indigo-100 drop-shadow-sm">{locationName}</h2>
          </div>
          
          <div className="text-5xl md:text-7xl font-extrabold mb-1 md:mb-2 tracking-tighter drop-shadow-lg">
            {temp !== undefined && temp !== null ? Math.round(temp) : "--"}°C
          </div>
          
          <div className="text-lg md:text-xl font-medium text-indigo-50 mb-4 md:mb-6 drop-shadow-md">
            {condition.text}
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 w-full">
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-md shadow-[0_4px_15px_rgb(0,0,0,0.1)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-white">Humidity: {humidity}%</span>
            </div>
            
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-3 py-2 md:px-4 md:py-2.5 backdrop-blur-md shadow-[0_4px_15px_rgb(0,0,0,0.1)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-white">Wind: {wind} km/h</span>
            </div>
          </div>
        </div>
        
        {/* 3. NESTED ANIMATION FOR THE WEATHER ICON */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-7xl md:text-9xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.3)] mt-4 md:mt-0"
        >
          {condition.icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroCard;
import React from 'react';

// Helper function to map Open-Meteo weather codes to emoji icons and text
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
  // Wait for data to load before trying to render
  if (!weatherData) return null;

  // Safely extract values from the API structure
  const temp = weatherData?.current?.temperature_2m ?? weatherData?.current_weather?.temperature;
  const humidity = weatherData?.current?.relative_humidity_2m ?? "--";
  const wind = weatherData?.current?.wind_speed_10m ?? weatherData?.current_weather?.windspeed ?? "--";
  const weatherCode = weatherData?.current?.weather_code ?? weatherData?.current_weather?.weathercode ?? 0;
  
  const condition = getWeatherCondition(weatherCode);

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold tracking-wider uppercase text-indigo-100 mb-1">{locationName}</h2>
          
          {/* Temperature Display */}
          <div className="text-6xl font-bold mb-2">
            {temp !== undefined && temp !== null ? Math.round(temp) : "--"}°C
          </div>
          
          <div className="text-lg font-medium text-indigo-100 mb-6">
            {condition.text}
          </div>
          
          <div className="flex space-x-4">
            {/* Humidity Badge - FIXED TAILWIND V4 SYNTAX */}
            <div className="flex items-center bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <span className="text-sm font-medium text-white">Humidity: {humidity}%</span>
            </div>
            
            {/* Wind Badge - FIXED TAILWIND V4 SYNTAX */}
            <div className="flex items-center bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-sm font-medium text-white">Wind: {wind} km/h</span>
            </div>
          </div>
        </div>
        
        {/* Weather Icon */}
        <div className="text-8xl drop-shadow-lg">
          {condition.icon}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
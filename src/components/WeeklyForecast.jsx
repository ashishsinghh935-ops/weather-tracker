import React from 'react';

const getWeatherCondition = (code) => {
  if (code === 0) return { icon: '☀️', text: 'Clear' };
  if (code >= 1 && code <= 3) return { icon: '⛅', text: 'Cloudy' };
  if (code >= 45 && code <= 48) return { icon: '🌫️', text: 'Foggy' };
  if (code >= 51 && code <= 67) return { icon: '🌧️', text: 'Rain' };
  if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Snow' };
  if (code >= 95) return { icon: '⛈️', text: 'Storm' };
  return { icon: '🌡️', text: 'Unknown' };
};

const WeeklyForecast = ({ dailyData }) => {
  if (!dailyData || !dailyData.time) return null;

  return (
    <div className="w-full bg-white shadow-sm border border-gray-200 rounded-none p-4 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">7-Day Outlook</h3>
      
      <div className="flex overflow-x-auto space-x-4 pb-2 snap-x hide-scrollbar">
        {dailyData.time.map((date, index) => {
          const maxTemp = dailyData.temperature_2m_max[index];
          const minTemp = dailyData.temperature_2m_min[index];
          const condition = getWeatherCondition(dailyData.weather_code[index]);
          
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <div 
              key={index} 
              className="flex-shrink-0 w-32 bg-gray-50 border border-gray-200 p-4 flex flex-col items-center justify-center snap-center hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                {index === 0 ? 'Today' : dayName}
              </span>
              
              <span className="text-4xl my-3">{condition.icon}</span>
              
              <span className="text-xs font-bold text-gray-700 text-center uppercase tracking-wide mb-3">
                {condition.text}
              </span>
              
              <div className="flex space-x-3 text-sm">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">High</span>
                  <span className="text-red-600 font-bold">{Math.round(maxTemp)}°</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">Low</span>
                  <span className="text-blue-600 font-bold">{Math.round(minTemp)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyForecast;
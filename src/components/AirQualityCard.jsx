import { useState, useEffect } from 'react';

const AirQualityCard = ({ location }) => {
  const [aqiData, setAqiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAQI = async () => {
      setIsLoading(true);
      try {
        // Open-Meteo's dedicated Air Quality API
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone`;
        const response = await fetch(url);
        const data = await response.json();
        
        setAqiData(data.current);
        setIsLoading(false);
      } catch (error) {
        console.error("AQI Fetch Error:", error);
        setIsLoading(false);
      }
    };

    fetchAQI();
  }, [location]); // Re-runs whenever you search a new city!

  // Helper function to color-code the severity of the air quality
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-500', bg: 'bg-orange-50' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-500', bg: 'bg-red-50' };
    return { label: 'Hazardous', color: 'text-purple-600', bg: 'bg-purple-50' };
  };

  if (isLoading || !aqiData) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 h-40 flex items-center justify-center text-slate-400">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl mr-3"></i>
        <span className="font-medium">Running atmospheric analysis...</span>
      </div>
    );
  }

  const status = getAQIStatus(aqiData.european_aqi);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Air Quality Analytics</h3>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status.bg} ${status.color}`}>
          AQI: {aqiData.european_aqi} - {status.label}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 font-bold mb-1">PM2.5</p>
          <p className="text-xl font-bold text-slate-700">{aqiData.pm2_5} <span className="text-sm font-normal text-slate-400">µg/m³</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 font-bold mb-1">PM10</p>
          <p className="text-xl font-bold text-slate-700">{aqiData.pm10} <span className="text-sm font-normal text-slate-400">µg/m³</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 font-bold mb-1">Ozone (O₃)</p>
          <p className="text-xl font-bold text-slate-700">{aqiData.ozone} <span className="text-sm font-normal text-slate-400">µg/m³</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 font-bold mb-1">Nitrogen (NO₂)</p>
          <p className="text-xl font-bold text-slate-700">{aqiData.nitrogen_dioxide} <span className="text-sm font-normal text-slate-400">µg/m³</span></p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 font-bold mb-1">Carbon (CO)</p>
          <p className="text-xl font-bold text-slate-700">{aqiData.carbon_monoxide} <span className="text-sm font-normal text-slate-400">µg/m³</span></p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;
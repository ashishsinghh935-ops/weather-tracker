const WeatherMap = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 h-80 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Live Radar</h3>
      <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50 relative overflow-hidden">
        <i className="fa-solid fa-map-location-dot text-2xl mr-3 z-10"></i> 
        <span className="font-medium z-10">Leaflet Map Will Go Here</span>
      </div>
    </div>
  );
};

export default WeatherMap;
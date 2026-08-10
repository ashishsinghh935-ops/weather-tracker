const WeatherMap = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Live Radar</h3>
      
      <div className="flex-1 w-full h-full rounded-xl overflow-hidden z-0 border border-slate-200">
        <iframe 
          title="Google Map"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          loading="lazy" 
          allowFullScreen 
          referrerPolicy="no-referrer-when-downgrade" 
          src="https://www.google.com/maps?q=Delhi,India&z=10&output=embed"
        ></iframe>
      </div>
    </div>
  );
};

export default WeatherMap;
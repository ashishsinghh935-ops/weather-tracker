const WeatherChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 h-80 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Temperature Trend</h3>
      <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50">
        <i className="fa-solid fa-chart-line text-2xl mr-3"></i> 
        <span className="font-medium">Chart.js Canvas Will Go Here</span>
      </div>
    </div>
  );
};

export default WeatherChart;
const Sidebar = () => {
  return (
    <aside className="w-72 min-w-[18rem] h-full bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 text-white w-9 h-9 flex items-center justify-center rounded-lg text-xl">
          <i className="fa-solid fa-cloud-bolt"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">WeatherPro</h2>
          <span className="text-[0.65rem] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
            Enterprise
          </span>
        </div>
      </div>

      {/* Search Area */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search city..." 
            className="w-full py-2.5 pl-9 pr-3 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 transition-all"
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-sm hover:shadow-md">
          <i className="fa-solid fa-location-crosshairs"></i>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav>
        <p className="text-xs uppercase text-slate-400 font-bold mb-2 tracking-wider">Menu</p>
        <ul className="flex flex-col gap-1">
          <li className="bg-indigo-50 text-indigo-600 font-semibold rounded-md flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors">
            <i className="fa-solid fa-chart-pie w-5 text-center"></i> 
            <span>Dashboard</span>
          </li>
          <li className="text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-md flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors font-medium">
            <i className="fa-solid fa-map-location-dot w-5 text-center"></i> 
            <span>Weather Map</span>
          </li>
          <li className="text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-md flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors font-medium">
            <i className="fa-solid fa-wind w-5 text-center"></i> 
            <span>Air Quality Analytics</span>
          </li>
        </ul>
      </nav>

      {/* Saved Cities Placeholder */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Saved Cities</p>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          <li className="text-sm text-slate-500 italic px-1">No pinned locations yet</li>
        </ul>
      </div>

    </aside>
  );
};

export default Sidebar;
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const routerLocation = useLocation();
  const currentPath = routerLocation.pathname;

  const handleSearchTyping = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=5&language=en&format=json`);
        const data = await response.json();
        
        if (data.results) {
          setSuggestions(data.results);
          setIsDropdownOpen(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Geocoding fetch error:", error);
      }
    } else {
      setIsDropdownOpen(false);
      setSuggestions([]);
    }
  };

  const handleCitySelect = (city) => {
    setQuery(`${city.name}, ${city.country}`);
    setIsDropdownOpen(false);
    
    if (onCitySelect) {
      onCitySelect({
        name: city.name,
        country: city.country || '',
        lat: city.latitude,
        lon: city.longitude
      });
    }
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-100 p-6 flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <i className="fa-solid fa-cloud-bolt"></i>
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-800 leading-tight">WeatherPro</h1>
          <p className="text-[10px] font-bold text-indigo-600 tracking-wider">ENTERPRISE</p>
        </div>
      </div>

      {/* SEARCH BAR WITH DROPDOWN */}
      <div className="relative w-full mb-8">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
          <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2"></i>
          <input
            type="text"
            className="w-full outline-none text-sm text-slate-700 bg-transparent"
            placeholder="Search city..."
            value={query}
            onChange={handleSearchTyping}
          />
        </div>

        {/* The Floating Dropdown Menu */}
        {isDropdownOpen && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-white border border-slate-200 shadow-xl rounded-lg mt-2 max-h-60 overflow-y-auto overflow-x-hidden">
            {suggestions.map((city) => (
              <li
                key={city.id}
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer text-sm text-slate-700 flex justify-between items-center border-b border-slate-50 last:border-0 transition-colors"
                onClick={() => handleCitySelect(city)}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{city.name}</span>
                  {city.admin1 && <span className="text-slate-400 text-xs">{city.admin1}</span>}
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {city.country_code}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Menu Links with React Router */}
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-400 mb-3 tracking-wider">MENU</p>
        
        <Link 
          to="/" 
          className={`px-4 py-2.5 rounded-lg flex items-center font-semibold text-sm cursor-pointer mb-2 transition-colors ${
            currentPath === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-chart-pie w-6"></i> Dashboard
        </Link>

        <Link 
          to="/map" 
          className={`px-4 py-2.5 rounded-lg flex items-center font-semibold text-sm cursor-pointer transition-colors ${
            currentPath === '/map' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-map-location-dot w-6"></i> Weather Map
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
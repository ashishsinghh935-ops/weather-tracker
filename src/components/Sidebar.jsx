import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cityTrie } from '../utils/Trie'; 

const Sidebar = ({ setLocation, isDay, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const locationPath = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const results = cityTrie.searchPrefix(searchQuery);
    if (results.length > 0) {
      setSuggestions(results);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  const handleSelectCity = async (cityName) => {
    setSearchQuery('');
    setShowDropdown(false);
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false); 
    try {
      const searchName = cityName.split(',')[0].trim();
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchName}&count=1&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setLocation({ lat: data.results[0].latitude, lon: data.results[0].longitude, name: cityName });
        navigate('/');
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const isActive = (path) => locationPath.pathname === path;

  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* UPGRADED: Premium Zinc Dark Mode Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-500 ease-in-out z-50 w-72 md:w-64 border-r flex flex-col p-4 shadow-2xl md:shadow-sm ${
        isDay ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#18181b] border-zinc-800 text-zinc-100'
      }`}>
        
        <div className="flex justify-end md:hidden mb-2">
          <button onClick={() => setIsMobileMenuOpen(false)} className={isDay ? 'text-gray-500' : 'text-zinc-400'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">WeatherPro</h1>
            <p className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">Enterprise</p>
          </div>
        </div>

        <div className="mb-8 relative" ref={dropdownRef}>
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDay ? 'bg-white border border-gray-200 text-gray-900' : 'bg-[#27272a] border border-zinc-700 text-white placeholder-zinc-400'
              }`}
            />
          </div>

          {showDropdown && suggestions.length > 0 && (
            <ul className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto border ${
              isDay ? 'bg-white border-gray-200' : 'bg-[#27272a] border-zinc-700'
            }`}>
              {suggestions.map((cityName, index) => (
                <li key={index} onClick={() => handleSelectCity(cityName)}
                  className={`px-4 py-3 md:py-2 cursor-pointer text-sm border-b last:border-b-0 ${
                    isDay ? 'hover:bg-indigo-50 border-gray-100 text-gray-800' : 'hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  }`}
                >
                  <div className="font-semibold">{cityName}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1">
          <p className={`text-xs font-bold mb-4 tracking-wider ${isDay ? 'text-gray-400' : 'text-zinc-500'}`}>MENU</p>
          <nav className="space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 md:py-2.5 rounded-lg transition-colors duration-200 ${
                isActive('/') 
                  ? (isDay ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'bg-indigo-500/20 text-indigo-300 font-semibold') 
                  : (isDay ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' : 'text-zinc-400 hover:bg-[#27272a] hover:text-zinc-200')
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              <span>Dashboard</span>
            </Link>

            <Link to="/map" onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 md:py-2.5 rounded-lg transition-colors duration-200 ${
                isActive('/map') 
                  ? (isDay ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'bg-indigo-500/20 text-indigo-300 font-semibold') 
                  : (isDay ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' : 'text-zinc-400 hover:bg-[#27272a] hover:text-zinc-200')
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <span>Weather Map</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
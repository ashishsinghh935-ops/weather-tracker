import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ setLocation }) => {
  const locationPath = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Autocomplete fetch effect
  useEffect(() => {
    const fetchCities = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    // Debounce the API call so it doesn't spam on every single keystroke
    const debounce = setTimeout(() => {
      fetchCities();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Click handler for when a user selects a city from the dropdown
  const handleSelectCity = (city) => {
    setLocation({
      lat: city.latitude,
      lon: city.longitude,
      name: `${city.name}, ${city.country}`
    });
    setSearchQuery('');
    setShowDropdown(false);
    navigate('/');
  };

  const isActive = (path) => locationPath.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm z-50 hidden md:flex">
      
      {/* Brand Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">WeatherPro</h1>
          <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">Enterprise</p>
        </div>
      </div>

      {/* Search Bar with Dropdown Container */}
      <div className="mb-8 relative" ref={dropdownRef}>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* The Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {suggestions.map((city, index) => (
              <li 
                key={index}
                onClick={() => handleSelectCity(city)}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
              >
                <div className="font-semibold text-gray-800">{city.name}</div>
                <div className="text-xs text-gray-500">{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-400 mb-4 tracking-wider">MENU</p>
        <nav className="space-y-2">
          <Link 
            to="/" 
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive('/') 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/map" 
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
              isActive('/map') 
                ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Weather Map</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
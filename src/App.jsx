import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HeroCard from './components/HeroCard';
import WeatherChart from './components/WeatherChart';
import WeatherMap from './components/WeatherMap';

function App() {
  // 1. MASTER STATE: Holds the currently selected city (Defaults to Delhi)
  const [location, setLocation] = useState({
    name: 'Delhi, India',
    lat: 28.6139,
    lon: 77.2090
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch data whenever the 'location' changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      setIsLoading(true); 
      try {
        // Now using dynamic variables for lat and lon!
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        setCurrentWeather(data.current);
        setIsLoading(false);
      } catch (error) {
        console.error("Engine Error: Failed to fetch weather data", error);
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]); // <--- This array tells React: "Re-run the fetch every time location changes!"

  // 3. Handler for when a user clicks a city in the Sidebar
  const handleCityChange = (cityData) => {
    setLocation({
      name: `${cityData.name}, ${cityData.country}`,
      lat: cityData.lat,
      lon: cityData.lon
    });
  };

  return (
    <div className="flex w-screen h-screen bg-slate-50 overflow-hidden text-slate-800">
      
      {/* Pass the handler to the Sidebar */}
      <Sidebar onCitySelect={handleCityChange} />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end">
          <div>
            {/* Dynamic Title! */}
            <h1 className="text-3xl font-bold text-slate-900">{location.name}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLoading ? "Establishing satellite connection..." : "Live Weather & Analytics"}
            </p>
          </div>
        </header>
        
        <HeroCard data={currentWeather} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {/* Pass the location down to Chart and Map so they update too */}
          <WeatherChart location={location} />
          <WeatherMap location={location} />
        </div>
        
      </main>
    </div>
  );
}

export default App;
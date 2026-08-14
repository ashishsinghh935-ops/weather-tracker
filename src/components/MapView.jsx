import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import WindLayer from './WindLayer';

// Fix for default Leaflet icons not loading in React
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const MapUpdater = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 10, {
      duration: 1.5 
    });
  }, [lat, lon, map]);
  
  return null;
};

// Component to handle map clicks and API fetching
const LocationMarker = ({ setLocation, navigate }) => {
  const [position, setPosition] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      setLoading(true);

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const geoData = await geoRes.json();
        const cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.name || "Unknown Location";

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`);
        const weatherDataRes = await weatherRes.json();

        setWeatherData({
          name: cityName,
          lat: lat.toFixed(2),
          lon: lng.toFixed(2),
          temp: weatherDataRes.current_weather.temperature,
          wind: weatherDataRes.current_weather.windspeed,
          humidity: weatherDataRes.hourly.relativehumidity_2m[0]
        });
      } catch (error) {
        console.error("Error fetching map location data:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup className="rounded-lg shadow-sm">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Scanning atmosphere...</div>
        ) : weatherData ? (
          <div className="flex flex-col space-y-3 min-w-[200px] p-1">
            <h4 className="font-bold text-gray-900">{weatherData.name}</h4>
            <p className="text-xs text-gray-500">(Lat: {weatherData.lat}, Lon: {weatherData.lon})</p>
            
            <div className="text-2xl font-bold text-indigo-600 my-2">
              {weatherData.temp}°C
            </div>
            
            <div className="text-xs text-gray-600 flex flex-col space-y-1 mb-2">
              <span>Humidity: {weatherData.humidity}%</span>
              <span>Wind: {weatherData.wind} km/h</span>
            </div>
            
            <button 
              className="w-full bg-indigo-600 text-white rounded-md py-2 mt-2 hover:bg-indigo-700 transition font-semibold text-sm flex items-center justify-center gap-2"
              onClick={() => {
                setLocation({
                  lat: parseFloat(weatherData.lat),
                  lon: parseFloat(weatherData.lon),
                  name: weatherData.name
                });
                navigate('/');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              View in Dashboard
            </button>
          </div>
        ) : null}
      </Popup>
    </Marker>
  );
};

// Accept weatherData dynamically from master App.jsx state
const MapView = ({ location, setLocation, weatherData }) => {
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [showWind, setShowWind] = useState(false);

  // Extract live wind vectors from the payload
  const actualWindSpeed = weatherData?.current?.wind_speed_10m || 0;
  const actualWindDirection = weatherData?.current?.wind_direction_10m || 0;

  // HTML5 Geolocation API Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          const cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.name || "My Location";
          
          setLocation({
            lat: latitude,
            lon: longitude,
            name: cityName
          });
        } catch (error) {
          console.error("Error fetching location name:", error);
          setLocation({ lat: latitude, lon: longitude, name: "My Location" });
        } finally {
          setIsLocating(false);
        }
      }, 
      (error) => {
        setIsLocating(false);
        alert("Unable to retrieve your location. Please check your browser permissions.");
      }
    );
  };

  return (
    <div className="h-full w-full flex flex-col space-y-2">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Interactive Radar & Point-and-Click Weather</h2>
        <p className="text-gray-500 text-sm mt-1">Click anywhere on the map to instantly scan atmospheric data for that coordinate.</p>
      </div>
      
      <div className="flex-1 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative min-h-[600px]">
        
        {/* Pass live Open-Meteo variables directly into the Canvas */}
        {showWind && <WindLayer windSpeed={actualWindSpeed} windDirection={actualWindDirection} />}

        {/* Floating GPS "Locate Me" Button */}
        <button 
          onClick={handleLocateMe}
          disabled={isLocating}
          className="absolute top-4 right-4 z-[400] bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all group disabled:opacity-70 flex items-center justify-center cursor-pointer"
          title="Find My Location"
        >
          {isLocating ? (
            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="M4 12H2"></path>
              <path d="M22 12h-2"></path>
              <circle cx="12" cy="12" r="8"></circle>
            </svg>
          )}
        </button>

        {/* Wind Radar Toggle Button */}
        <button 
          onClick={() => setShowWind(!showWind)}
          className={`absolute top-20 right-4 z-[400] p-3 rounded-full shadow-lg border transition-all group flex items-center justify-center cursor-pointer ${showWind ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
          title="Toggle Wind Radar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${showWind ? 'text-indigo-600' : 'text-gray-700 group-hover:text-indigo-600 transition-colors'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
          </svg>
        </button>

        <MapContainer 
          center={[location.lat, location.lon]} 
          zoom={10} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater lat={location.lat} lon={location.lon} />

          <Marker position={[location.lat, location.lon]}>
            <Popup className="font-semibold text-indigo-600">
              Active Location:<br/>
              <span className="text-gray-800">{location.name}</span>
            </Popup>
          </Marker>

          <LocationMarker setLocation={setLocation} navigate={navigate} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
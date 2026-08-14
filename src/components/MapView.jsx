import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

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
        // Reverse Geocoding API to get City Name
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const geoData = await geoRes.json();
        const cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.name || "Unknown Location";

        // Open-Meteo API for Weather Data at Coordinates
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
                // Update master state in App.jsx
                setLocation({
                  lat: parseFloat(weatherData.lat),
                  lon: parseFloat(weatherData.lon),
                  name: weatherData.name
                });
                // Route back to the main dashboard
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

const MapView = ({ location, setLocation }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col space-y-2">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Interactive Radar & Point-and-Click Weather</h2>
        <p className="text-gray-500 text-sm mt-1">Click anywhere on the map to instantly scan atmospheric data for that coordinate.</p>
      </div>
      
      {/* Map Container */}
      <div className="flex-1 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative min-h-[600px]">
        <MapContainer 
          center={[location.lat, location.lon]} 
          zoom={5} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker setLocation={setLocation} navigate={navigate} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
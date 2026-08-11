import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapView = ({ onCitySelect }) => {
  const navigate = useNavigate();
  
  const [clickedLocation, setClickedLocation] = useState({
    lat: 28.6139,
    lon: 77.2090,
    name: "Delhi, India"
  });
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [clickedLocation]);

  const handleMapClick = async (latlng) => {
    setIsLoading(true);
    const { lat, lng } = latlng;
    
    try {
      // 1. Fetch live weather data
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      // 2. Reverse Geocoding: Translate coordinates to a real place name!
      let placeName = "Unknown Location";
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        // Try to grab the most accurate name available
        if (geoData && geoData.address) {
          placeName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || geoData.address.state || geoData.address.country || "Unknown Location";
        }
      } catch (geoError) {
        console.error("Failed to get place name:", geoError);
      }

      setWeatherData(weatherData.current);
      
      // 3. Format it exactly how you requested: "Place Name (Lat: X, Lon: Y)"
      const formattedTitle = `${placeName} (Lat: ${lat.toFixed(2)}, Lon: ${lng.toFixed(2)})`;

      setClickedLocation({
        lat: lat,
        lon: lng,
        name: formattedTitle
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Map click weather fetch error:", error);
      setIsLoading(false);
    }
  };

  const handleLaunchDashboard = () => {
    if (onCitySelect) {
      onCitySelect({
        name: clickedLocation.name,
        lat: clickedLocation.lat,
        lon: clickedLocation.lon,
        country: ""
      });
      navigate('/');
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col relative">
      <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Interactive Radar & Point-and-Click Weather</h2>
          <p className="text-sm text-slate-400">Click anywhere on the map to instantly scan atmospheric data for that coordinate.</p>
        </div>
      </div>

      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          center={[28.6139, 77.2090]} 
          zoom={8} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onMapClick={handleMapClick} />
          
          <Marker position={[clickedLocation.lat, clickedLocation.lon]} ref={markerRef}>
            <Popup>
              <div className="p-2 w-48">
                <p className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2 leading-tight">
                  {clickedLocation.name}
                </p>
                {isLoading ? (
                  <p className="text-xs text-slate-400">Scanning satellite telemetry...</p>
                ) : weatherData ? (
                  <div className="text-sm flex flex-col gap-1">
                    <p className="font-bold text-indigo-600 text-xl mb-1">{weatherData.temperature_2m}°C</p>
                    <p className="text-slate-500 text-xs">Humidity: {weatherData.relative_humidity_2m}%</p>
                    <p className="text-slate-500 text-xs">Wind: {weatherData.wind_speed_10m} km/h</p>
                    
                    <button 
                      onClick={handleLaunchDashboard}
                      className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      <i className="fa-solid fa-chart-line mr-1"></i> View in Dashboard
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Click telemetry loaded.</p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
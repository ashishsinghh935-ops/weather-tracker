import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to listen for clicks on the map canvas
const ClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const MapView = () => {
  const [clickedLocation, setClickedLocation] = useState({
    lat: 28.6139,
    lon: 77.2090,
    name: "Delhi, India"
  });
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a reference to control the Marker
  const markerRef = useRef(null);

  // Automatically open the popup whenever the clicked location changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [clickedLocation]);

  const handleMapClick = async (latlng) => {
    setIsLoading(true);
    const { lat, lng } = latlng;
    
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
      const response = await fetch(weatherUrl);
      const data = await response.json();

      setWeatherData(data.current);
      setClickedLocation({
        lat: lat,
        lon: lng,
        name: `Lat: ${lat.toFixed(2)}, Lon: ${lng.toFixed(2)}`
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Map click weather fetch error:", error);
      setIsLoading(false);
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
          
          {/* Attach the ref to the Marker! */}
          <Marker position={[clickedLocation.lat, clickedLocation.lon]} ref={markerRef}>
            <Popup>
              <div className="p-2">
                <p className="font-bold text-slate-800">{clickedLocation.name}</p>
                {isLoading ? (
                  <p className="text-xs text-slate-400 mt-1">Scanning satellite telemetry...</p>
                ) : weatherData ? (
                  <div className="mt-2 text-sm">
                    <p className="font-semibold text-indigo-600 text-lg">{weatherData.temperature_2m}°C</p>
                    <p className="text-slate-500 text-xs">Humidity: {weatherData.relative_humidity_2m}%</p>
                    <p className="text-slate-500 text-xs">Wind: {weatherData.wind_speed_10m} km/h</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Click telemetry loaded.</p>
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
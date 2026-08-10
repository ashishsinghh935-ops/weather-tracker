import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for the default Leaflet marker icon missing in Vite builds
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const WeatherMap = () => {
  // Coordinates for Delhi
  const position = [28.6139, 77.2090]; 

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Live Radar</h3>
      
      {/* z-0 ensures the map doesn't overlap other UI elements */}
      <div className="flex-1 w-full h-full rounded-xl overflow-hidden z-0 border border-slate-200">
        <MapContainer 
          center={position} 
          zoom={10} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <span className="font-bold text-slate-800">Delhi, India</span><br />
              Weather Station Telemetry.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default WeatherMap;
# WeatherPro 

A modern, multi-page React application providing real-time weather telemetry, air quality analytics, and interactive global map scanning. Built with an emphasis on high-performance rendering and a professional-grade user interface.

## 🚀 Key Features

*   **Global Interactive Radar:** Full-screen Leaflet map integration. Click anywhere in the world to instantly fetch local atmospheric data and reverse-geocode precise coordinates into real-world place names.
*   **Dynamic Telemetry Dashboard:** A robust central state management system that synchronizes data across multiple analytical widgets simultaneously.
*   **Smart Search & Autocomplete:** Predictive city search powered by the Open-Meteo Geocoding API.
*   **Air Quality Analytics:** Real-time tracking of PM2.5, PM10, Ozone (O₃), Nitrogen Dioxide (NO₂), and overall AQI.
*   **24-Hour Forecasting:** Fluid, interactive temperature trend charts built with Chart.js.
*   **Live Satellite Tracking:** Embedded coordinate-based radar for visual weather pattern monitoring.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 18, Vite
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS
*   **Mapping:** React-Leaflet, Google Maps API (Embed)
*   **Data Visualization:** Chart.js, React-Chartjs-2
*   **APIs:** 
    *   Open-Meteo (Weather, Air Quality, Geocoding)
    *   Nominatim (Reverse Geocoding)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/weather-tracker.git](https://github.com/your-username/weather-tracker.git)
   cd weather-tracker
   ```


   Install dependencies
   npm install

   Start the development server
   npm run dev
The application will launch locally at http://localhost:5173/.

🏗️ Architecture Overview
WeatherPro utilizes a multi-page architecture via React Router. The application maintains a central "Master State" in App.jsx that securely holds the currently selected location (latitude, longitude, and formatted name).

When a user interacts with the MapView or the Sidebar search, the master state is updated, instantly triggering a re-render of the HeroCard, WeatherChart, AirQualityCard, and WeatherMap components with fresh satellite telemetry.
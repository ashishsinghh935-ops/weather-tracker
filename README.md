# WeatherPro 

![Deployment Status](https://img.shields.io/badge/deployment-live-success?style=for-the-badge&logo=vercel)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A modern, multi-page React application providing real-time weather telemetry, air quality analytics, and interactive global map scanning. Built with an emphasis on high-performance rendering, strict production-ready codebases, and a professional-grade user interface.

**🟢 Live Demo:** [View on Vercel](https://weather-tracker-livid-ten.vercel.app)

## 🚀 Key Features

*   **Global Interactive Radar:** Full-screen Leaflet map integration. Click anywhere in the world to instantly fetch local atmospheric data and reverse-geocode precise coordinates into real-world place names.
*   **Dynamic Master State:** A robust centralized state management system that synchronizes data across multiple analytical widgets and application pages simultaneously.
*   **Smart Search & Autocomplete:** Predictive city search powered by the Open-Meteo Geocoding API.
*   **Air Quality Analytics:** Real-time tracking of PM2.5, PM10, Ozone (O₃), Nitrogen Dioxide (NO₂), and overall AQI.
*   **24-Hour Forecasting:** Fluid, interactive temperature trend charts built with Chart.js.
*   **Live Satellite Tracking:** Embedded coordinate-based radar for visual weather pattern monitoring.
*   **Enterprise Routing:** Multi-page architecture utilizing React Router for seamless navigation between the dashboard and full-screen map views.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 18, Vite
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS v4 (with updated PostCSS integration)
*   **Mapping:** React-Leaflet, Google Maps API (Embed)
*   **Data Visualization:** Chart.js, React-Chartjs-2
*   **APIs:** 
    *   Open-Meteo (Weather, Air Quality, Geocoding)
    *   Nominatim (Reverse Geocoding)
*   **Deployment:** Vercel (CI/CD Pipeline)

## 📦 Installation & Local Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/ashishsinghh935-ops/weather-tracker.git](https://github.com/ashishsinghh935-ops/weather-tracker.git)
   cd weather-tracker
   ```
2. **Install dependencies**
```bash
npm install
```
3. **Start the development server**
```bash
npm run dev
```
The application will launch locally at http://localhost:5173/.


##🏗️ Architecture Overview
WeatherPro utilizes a multi-page architecture via React Router. The application maintains a central "Master State" in App.jsx that securely holds the currently selected location (latitude, longitude, and formatted name).

When a user interacts with the MapView or the Sidebar search, the master state is updated, instantly triggering a re-render of the HeroCard, WeatherChart, AirQualityCard, and WeatherMap components with fresh satellite telemetry. The project is strictly typed for case-sensitive Linux server deployments and utilizes the latest Tailwind CSS v4 engine for optimal styling performance.
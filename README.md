# 🌤️ WeatherPro Dashboard

A professional, enterprise-grade weather analytics dashboard built with modern web technologies. It features live 3D weather particle animations, interactive Chart.js visualizations, auto-geolocation, real-time air quality analytics, and an integrated Leaflet weather map.

## ✨ Features
* **3D Weather Animations:** Dynamic WebGL particle engine powered by Three.js that renders realistic falling rain, drifting snow, or ambient clear-sky particles inside the main hero card.
* **Interactive Data Visualization:** Smooth, curved temperature trend graphs built with Chart.js, featuring hover tooltips and custom gradient fills.
* **Auto-Geolocation API:** One-click GPS location detection using browser geolocation combined with reverse-geocoding to instantly fetch local weather.
* **Live Autocomplete Search:** Global city search with a YouTube-style dropdown powered by the Open-Meteo Geocoding API.
* **Detailed Air Quality Analytics:** Real-time pollutant breakdown (PM2.5, PM10, NO₂, O₃, SO₂, CO) visualized with dynamic, health-status-colored progress bars.
* **Interactive Weather Map:** Integrated Leaflet.js mapping with a minimalist CartoDB Positron tile layer for fast geographic visualization.
* **Optimized Forecasting:** A streamlined horizontal scroll track displaying conditions every 2 hours to prevent information overload, paired with a comprehensive 7-day extended forecast.
* **Comprehensive Metrics:** Tracks UV Index, Wind Speed/Direction, Humidity, Dew Point, Atmospheric Pressure, and Visibility.
* **Persistent Storage:** Saves pinned favorite locations locally using browser `localStorage`.
* **Responsive SaaS Design:** Custom CSS Grid layout with styled scrollbars, dynamic hover states, and a modern color palette built from scratch.

## 🚀 Live Demo
[View Live Project](https://weather-tracker-livid-ten.vercel.app/)

## 🛠️ Built With
* **Frontend:** HTML5, CSS3 (CSS Grid/Flexbox), JavaScript (ES6+)
* **APIs:** Open-Meteo Weather API & Air Quality API, BigDataCloud Reverse Geocoding API
* **Libraries:** Three.js (3D Animations), Chart.js (Data Visualization), Leaflet.js (Mapping)
* **Assets:** FontAwesome Icons
* **Deployment:** Vercel

## 💻 How to Run Locally
1. Clone this repository to your local machine:
   ```bash
   git clone [https://github.com/ashishsingh935-ops/weather-tracker.git](https://github.com/ashishsingh935-ops/weather-tracker.git)
   ```

Open the project directory in your code editor.
Open index.html using a Live Server extension to view the dashboard.
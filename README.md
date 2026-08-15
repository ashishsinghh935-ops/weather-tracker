# 🌦️ WeatherPro Enterprise

A high-performance, enterprise-grade weather tracking dashboard built with React. Designed for speed and visual fidelity, WeatherPro integrates real-time atmospheric data with advanced caching algorithms and a custom HTML5 canvas physics engine to visualize live meteorological conditions.

## 🚀 Key Engineering Features

* **Dynamic Meteorological Physics Engine:** A custom HTML5 `<canvas>` rendering layer overlaid on React-Leaflet. It ingests live Open-Meteo `weather_code` and `wind_direction` data to compute and render real-time vector fields for Rain, Snow, and Wind particle physics.
* **$O(1)$ LRU Algorithmic Caching:** Implements a custom Least Recently Used (LRU) caching mechanism using JavaScript Maps to eliminate redundant API network requests, resulting in zero-latency city switching.
* **Smart Interactive Radar:** Utilizes `react-leaflet` with custom hooks (`useMap`) for smooth `flyTo` camera panning. Includes an HTML5 Geolocation integration to instantly reverse-geocode and map the user's physical coordinates.
* **Time-of-Day Theme Binding:** Extracts `is_day` variables from the atmospheric payload to dynamically transition the entire application state between a vibrant daylight UI and a sleek dark-mode night UI.
* **Enterprise Perceived Performance:** Features highly optimized Tailwind CSS v4 pulse skeleton loaders to layout the DOM prior to API resolution.
* **Deep Glassmorphism UI:** Advanced CSS composition using backdrop blurs, semi-transparent gradients, and dimensional shadow offsets for a premium, tactile interface.

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite)
* **Routing:** React Router v6
* **Styling:** Tailwind CSS v4
* **Mapping:** React-Leaflet, Leaflet.js
* **Data Sources:** Open-Meteo API (Weather & Geocoding), OpenStreetMap Nominatim API (Reverse Geocoding)

## 💻 Local Development

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/weatherpro-enterprise.git](https://github.com/yourusername/weatherpro-enterprise.git)
   cd weatherpro-enterprise
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the local Vite development server:**
  ```bash
  npm run dev
  ```
  The application will boot up at http://localhost:5173/ with Hot Module Replacement (HMR) enabled.
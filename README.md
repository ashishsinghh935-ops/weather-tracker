# 🌦️ WeatherPro Enterprise

A high-performance, enterprise-grade weather tracking dashboard and Progressive Web App (PWA) built with React. Designed for speed and visual fidelity, WeatherPro integrates real-time atmospheric data with advanced caching algorithms, a custom in-memory Trie data structure, and a custom HTML5 canvas physics engine to visualize live meteorological conditions.

## 🚀 Key Engineering Features

* **Algorithmic Search (Zero Latency):** Implements a custom in-memory **Trie (Prefix Tree)** data structure to achieve $O(L)$ time complexity for instantaneous city autocomplete predictions, completely eliminating network latency during searches.
* **Dynamic Meteorological Physics Engine:** A custom HTML5 `<canvas>` rendering layer overlaid on React-Leaflet. It ingests live Open-Meteo `weather_code` and `wind_direction` data to compute and render real-time vector fields for Rain, Snow, and Wind particle physics.
* **State Persistence & $O(1)$ LRU Caching:** Implements a custom Least Recently Used (LRU) caching mechanism using JavaScript Maps to eliminate redundant API network requests. Integrates lazy initialization with `localStorage` to persistently remember user location preferences across sessions.
* **Progressive Web App (PWA) Architecture:** Fully responsive mobile-first design featuring a sliding navigation drawer, scalable typography, and Web App Manifest integration for native installation on iOS and Android devices.
* **Smart Interactive Radar & Dynamic Mapping:** Utilizes `react-leaflet` with custom hooks for smooth `flyTo` camera panning and HTML5 Geolocation reverse-geocoding. Dynamically swaps between bright OpenStreetMap tiles and sleek CartoDB Dark Matter tiles based on the atmospheric context.
* **Time-of-Day Theme Binding:** Extracts `is_day` variables from the atmospheric payload to dynamically transition the entire application state between a vibrant daylight UI and a deep, premium `zinc-950` dark-mode night UI.
* **Deep Glassmorphism UI:** Advanced CSS composition using backdrop blurs, semi-transparent gradients, and dimensional shadow offsets for a premium, tactile interface.
* **Enterprise Perceived Performance:** Features highly optimized Tailwind CSS v4 pulse skeleton loaders to layout the DOM prior to API resolution.

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite)
* **Routing:** React Router v6
* **Styling:** Tailwind CSS v4
* **Mapping:** React-Leaflet, Leaflet.js, OpenStreetMap, CartoDB
* **Data Sources:** Open-Meteo API (Weather Data), Nominatim API (Reverse Geocoding)
* **Algorithms:** JavaScript custom object-oriented Data Structures (Trie, LRU Cache)

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

  ## 📱 Mobile Installation

  Navigate to the live URL on any mobile browser. Tap "Share" (iOS) or "Menu" (Android) and select "Add to Home Screen" to install WeatherPro as a native application.
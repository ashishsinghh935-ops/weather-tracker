# 🌦️ WeatherPro 

A high-performance, enterprise-grade weather tracking dashboard and Progressive Web App (PWA) built with React. Designed for speed, visual fidelity, and cinematic UX, WeatherPro integrates real-time atmospheric data with advanced caching algorithms, a custom in-memory Trie data structure, and physics-based UI animations to visualize live meteorological conditions.

## 🚀 Key Engineering Features

* **Hybrid Autocomplete Engine:** Merges an $O(L)$ in-memory **Trie (Prefix Tree)** for zero-latency local searches with a debounced Open-Meteo Geocoding API integration, allowing for instant, globally scalable location discovery.
* **Ambient Weather Particle System:** A dynamic, full-screen background engine utilizing **Framer Motion** and CSS hardware acceleration to render immersive weather states (snow, rain, lightning strikes, and radial sun flares) continuously at 60 FPS.
* **Cinematic SVG Data Visualization:** Custom-built React-SVG charts that ditch clunky standard libraries. Utilizes Framer Motion `pathLength` animations, Bézier curve interpolation, and staggered spring pop-ins to visually "draw" data onto the screen.
* **Dynamic Meteorological Physics Engine:** A custom HTML5 `<canvas>` rendering layer overlaid on React-Leaflet. It ingests live Open-Meteo `weather_code` and `wind_direction` data to compute and render real-time vector fields for Rain, Snow, and Wind particle physics.
* **State Persistence & $O(1)$ LRU Caching:** Implements a custom Least Recently Used (LRU) caching mechanism using JavaScript Maps to eliminate redundant API network requests. Integrates lazy initialization with `localStorage` to persistently remember user location preferences across sessions.
* **Progressive Web App (PWA) Architecture:** Fully responsive mobile-first design featuring a sliding navigation drawer, scalable typography, and Web App Manifest integration for native installation on iOS and Android devices.
* **Smart Interactive Radar & Dynamic Mapping:** Utilizes `react-leaflet` with custom hooks for smooth `flyTo` camera panning and HTML5 Geolocation reverse-geocoding. Dynamically swaps between bright OpenStreetMap tiles and sleek CartoDB Dark Matter tiles based on the atmospheric context.
* **Time-of-Day Theme Binding:** Extracts `is_day` variables from the atmospheric payload to dynamically transition the entire application state between a vibrant daylight UI and a deep, premium `zinc-950` dark-mode night UI.
* **Deep Glassmorphism UI:** Advanced CSS composition using backdrop blurs, semi-transparent gradients, dimensional shadow offsets, and tactile hover physics for a premium interface.

## 🛠️ Tech Stack

* **Frontend Framework:** React (Vite), Framer Motion
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
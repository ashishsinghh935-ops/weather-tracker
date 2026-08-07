/**
 * WeatherPro - Professional Weather Dashboard Logic
 * Handles API fetching, DOM manipulation, state management, Leaflet Maps, and user interactions.
 */

// ==========================================================================
// 1. STATE MANAGEMENT & CONSTANTS
// ==========================================================================
const state = {
    currentLocation: {
        name: "Delhi, India",
        lat: 28.6139,
        lon: 77.2090
    },
    savedCities: JSON.parse(localStorage.getItem('weatherPro_savedCities')) || [],
    units: 'celsius', // 'celsius' or 'fahrenheit'
    isFetching: false
};

// Global Map Variables
let weatherMap = null;
let mapMarker = null;

// ==========================================================================
// 2. DOM ELEMENT SELECTORS
// ==========================================================================
const DOM = {
    // Search & Sidebar
    searchInput: document.getElementById('city-input'),
    suggestionsList: document.getElementById('suggestions-list'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    savedCitiesList: document.getElementById('saved-cities-list'),
    addFavoriteBtn: document.getElementById('add-favorite-btn'),
    bookmarkBtn: document.getElementById('bookmark-btn'),
    
    // Layout States & Views
    loadingState: document.getElementById('loading-state'),
    mainDashboard: document.getElementById('weather-display'),
    dashboardView: document.getElementById('dashboard-view'),
    mapSection: document.getElementById('weather-map-section'),
    refreshBtn: document.getElementById('refresh-data-btn'),
    toastContainer: document.getElementById('toast-container'),
    
    // Header
    cityName: document.getElementById('city-name'),
    currentDate: document.getElementById('current-date'),
    lastUpdated: document.getElementById('last-updated-time'),
    
    // Hero Section
    temp: document.getElementById('temperature'),
    condition: document.getElementById('condition'),
    feelsLike: document.getElementById('feels-like-temp'),
    mainIcon: document.getElementById('main-weather-icon'),
    tempMax: document.getElementById('temp-max'),
    tempMin: document.getElementById('temp-min'),
    sunrise: document.getElementById('sunrise-time'),
    sunset: document.getElementById('sunset-time'),
    
    // Hourly Track
    hourlyContainer: document.getElementById('hourly-container'),
    
    // Highlights
    aqiValue: document.getElementById('aqi-value'),
    aqiBadge: document.getElementById('aqi-status-badge'),
    aqiRec: document.getElementById('aqi-recommendation'),
    windSpeed: document.getElementById('wind-speed'),
    windDir: document.getElementById('wind-direction'),
    humidity: document.getElementById('humidity-value'),
    dewPoint: document.getElementById('dew-point'),
    uvIndex: document.getElementById('uv-index-value'),
    uvBadge: document.getElementById('uv-risk-badge'),
    uvAdvice: document.getElementById('uv-advice'),
    pressure: document.getElementById('pressure-value'),
    pressureTrend: document.getElementById('pressure-trend'),
    visibility: document.getElementById('visibility-value'),
    visibilityStatus: document.getElementById('visibility-status'),
    
    // 7-Day Forecast & Advisory
    forecastContainer: document.getElementById('forecast-container'),
    advisoryText: document.getElementById('advisory-text')
};

// ==========================================================================
// 3. INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    renderSavedCities();
    // Fetch default location on load
    fetchDashboardData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
}

// ==========================================================================
// 4. EVENT LISTENERS & NAVIGATION LOGIC
// ==========================================================================
function setupEventListeners() {
    let searchTimeout;

    // Live Search (Debounced)
    DOM.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            DOM.clearSearchBtn.classList.remove('hidden');
        } else {
            DOM.clearSearchBtn.classList.add('hidden');
            DOM.suggestionsList.classList.add('hidden');
            return;
        }

        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearch(query), 400);
    });

    // Clear Search
    DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        DOM.clearSearchBtn.classList.add('hidden');
        DOM.suggestionsList.classList.add('hidden');
        DOM.searchInput.focus();
    });

    // Hide suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar-search')) {
            DOM.suggestionsList.classList.add('hidden');
        }
    });

    // Manual Refresh
    DOM.refreshBtn.addEventListener('click', () => {
        fetchDashboardData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
        showToast("Refreshing live data...", "info");
    });

    // Save Location Button (Header & Sidebar)
    const saveLocationHandler = () => {
        toggleSavedCity(state.currentLocation);
    };
    DOM.bookmarkBtn.addEventListener('click', saveLocationHandler);
    DOM.addFavoriteBtn.addEventListener('click', saveLocationHandler);
    
    // Handle Navigation Menu Links (Dashboard vs Map)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update Active Class
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            e.currentTarget.parentElement.classList.add('active');
            
            const linkText = e.currentTarget.querySelector('span').textContent;
            
            if (linkText === 'Dashboard') {
                DOM.mapSection.classList.add('hidden');
                DOM.dashboardView.classList.remove('hidden');
            } 
            else if (linkText === 'Weather Map') {
                DOM.dashboardView.classList.add('hidden');
                DOM.mapSection.classList.remove('hidden');
                
                // Initialize or refresh map
                initMap(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
                
                // Leaflet workaround: Maps rendering in hidden divs need their size invalidated once visible
                setTimeout(() => {
                    if (weatherMap) weatherMap.invalidateSize();
                }, 100);
                
                showToast("Interactive weather map loaded", "success");
            } 
            else {
                showToast(`${linkText} module is coming soon!`, 'info');
            }
        });
    });
}

// ==========================================================================
// 5. LEAFLET MAP LOGIC
// ==========================================================================
function initMap(lat, lon, cityName) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // If map already exists, update view and marker
    if (weatherMap) {
        weatherMap.setView([lat, lon], 10);
        if (mapMarker) {
            mapMarker.setLatLng([lat, lon])
                     .setPopupContent(`<b>${cityName}</b>`)
                     .openPopup();
        }
        return;
    }

    // Initialize New Map
    weatherMap = L.map('map').setView([lat, lon], 10);

    // Standard OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(weatherMap);

    // Add Marker
    mapMarker = L.marker([lat, lon]).addTo(weatherMap)
        .bindPopup(`<b>${cityName}</b>`)
        .openPopup();
}

// ==========================================================================
// 6. API FETCHING LOGIC
// ==========================================================================
async function handleSearch(query) {
    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&format=json`);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            renderSuggestions(data.results);
        } else {
            DOM.suggestionsList.innerHTML = '<li class="empty-state" style="padding: 1rem;">No locations found</li>';
            DOM.suggestionsList.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Geocoding Error:", error);
    }
}

async function fetchDashboardData(lat, lon, cityName) {
    if (state.isFetching) return;
    state.isFetching = true;
    
    // Show loading state if we are currently on the dashboard view
    if (!DOM.dashboardView.classList.contains('hidden')) {
        DOM.mainDashboard.classList.add('hidden');
        DOM.loadingState.style.display = 'flex';
    }

    try {
        // Fetch Primary Weather Data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,visibility,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
        
        // Fetch AQI Data
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

        const [weatherRes, aqiRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(aqiUrl)
        ]);

        if (!weatherRes.ok || !aqiRes.ok) throw new Error("API response error");

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        // Update State
        state.currentLocation = { name: cityName, lat, lon };
        
        // Update UI Components
        updateHeader(cityName);
        updateHeroSection(weatherData.current, weatherData.daily);
        updateHighlights(weatherData.current, weatherData.hourly, weatherData.daily, aqiData.current);
        updateHourlyForecast(weatherData.hourly);
        updateDailyForecast(weatherData.daily);
        updateBookmarkStatus();
        
        // Update map silently in background if initialized
        if (weatherMap) {
            initMap(lat, lon, cityName);
        }

        // Reveal Dashboard
        DOM.loadingState.style.display = 'none';
        DOM.mainDashboard.classList.remove('hidden');
        showToast(`Weather data loaded for ${cityName}`, "success");

    } catch (error) {
        console.error("Dashboard Data Error:", error);
        showToast("Failed to load weather data. Please try again.", "error");
        DOM.loadingState.innerHTML = `<h3>Error loading data</h3><p>Please check your connection and try again.</p>`;
    } finally {
        state.isFetching = false;
    }
}

// ==========================================================================
// 7. UI RENDER FUNCTIONS
// ==========================================================================
function renderSuggestions(results) {
    DOM.suggestionsList.innerHTML = '';
    
    results.forEach(city => {
        const li = document.createElement('li');
        const adminStr = city.admin1 ? `${city.admin1}, ` : '';
        const fullName = `${city.name}, ${adminStr}${city.country}`;
        
        li.innerHTML = `<i class="fa-solid fa-location-dot"></i> <span style="margin-left: 8px;">${fullName}</span>`;
        li.addEventListener('click', () => {
            DOM.searchInput.value = '';
            DOM.clearSearchBtn.classList.add('hidden');
            DOM.suggestionsList.classList.add('hidden');
            fetchDashboardData(city.latitude, city.longitude, fullName);
        });
        
        DOM.suggestionsList.appendChild(li);
    });
    
    DOM.suggestionsList.classList.remove('hidden');
}

function updateHeader(cityName) {
    DOM.cityName.textContent = cityName;
    
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    DOM.currentDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${now.toLocaleDateString('en-US', dateOptions)}`;
    
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    DOM.lastUpdated.innerHTML = `<i class="fa-regular fa-clock"></i> Updated ${now.toLocaleTimeString('en-US', timeOptions)}`;
}

function updateHeroSection(current, daily) {
    const isDay = current.is_day === 1;
    const weatherInfo = getWeatherDetails(current.weather_code, isDay);
    
    DOM.temp.textContent = `${Math.round(current.temperature_2m)}°C`;
    DOM.condition.textContent = weatherInfo.text;
    DOM.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    
    DOM.mainIcon.className = weatherInfo.iconClass;
    
    DOM.tempMax.textContent = `${Math.round(daily.temperature_2m_max[0])}°C`;
    DOM.tempMin.textContent = `${Math.round(daily.temperature_2m_min[0])}°C`;
    DOM.sunrise.textContent = formatTime(daily.sunrise[0]);
    DOM.sunset.textContent = formatTime(daily.sunset[0]);
}

function updateHighlights(current, hourly, daily, aqiCurrent) {
    const aqi = aqiCurrent.us_aqi;
    DOM.aqiValue.textContent = aqi || "--";
    const aqiInfo = getAQIStatus(aqi);
    DOM.aqiBadge.textContent = aqiInfo.label;
    DOM.aqiBadge.style.backgroundColor = aqiInfo.color;
    DOM.aqiBadge.style.color = '#fff';
    DOM.aqiRec.textContent = aqiInfo.advice;

    DOM.windSpeed.textContent = Math.round(current.wind_speed_10m);
    DOM.windDir.textContent = getWindDirection(current.wind_direction_10m);

    DOM.humidity.textContent = current.relative_humidity_2m;
    const currentHour = new Date().getHours();
    DOM.dewPoint.textContent = `${Math.round(hourly.dew_point_2m[currentHour])}°C`;

    const uv = Math.round(daily.uv_index_max[0]);
    DOM.uvIndex.textContent = uv;
    const uvInfo = getUVStatus(uv);
    DOM.uvBadge.textContent = uvInfo.label;
    DOM.uvBadge.style.backgroundColor = uvInfo.color;
    DOM.uvBadge.style.color = '#fff';
    DOM.uvAdvice.textContent = uvInfo.advice;

    DOM.pressure.textContent = Math.round(current.surface_pressure);
    DOM.pressureTrend.textContent = current.surface_pressure > 1013 ? "Higher than standard." : "Lower than standard.";

    const visKm = (hourly.visibility[currentHour] / 1000).toFixed(1);
    DOM.visibility.textContent = visKm;
    DOM.visibilityStatus.textContent = visKm > 8 ? "Perfectly clear view." : "Visibility is slightly reduced.";
}

function updateHourlyForecast(hourly) {
    DOM.hourlyContainer.innerHTML = '';
    const currentHourIdx = new Date().getHours();
    
    for (let i = currentHourIdx; i < currentHourIdx + 24; i++) {
        const timeStr = new Date(hourly.time[i]).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const temp = Math.round(hourly.temperature_2m[i]);
        const weatherInfo = getWeatherDetails(hourly.weather_code[i], true); 
        
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <p class="hourly-time">${i === currentHourIdx ? 'Now' : timeStr}</p>
            <i class="${weatherInfo.iconClass} hourly-icon" style="margin: 8px 0; font-size: 1.2rem;"></i>
            <p class="hourly-temp">${temp}°</p>
        `;
        DOM.hourlyContainer.appendChild(card);
    }
}

function updateDailyForecast(daily) {
    DOM.forecastContainer.innerHTML = '';
    
    for (let i = 1; i <= 6; i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const weatherInfo = getWeatherDetails(daily.weather_code[i], true);
        const max = Math.round(daily.temperature_2m_max[i]);
        const min = Math.round(daily.temperature_2m_min[i]);

        const row = document.createElement('div');
        row.className = 'forecast-row';
        row.innerHTML = `
            <span class="day-name">${dayName}</span>
            <div class="forecast-condition-group" style="display: flex; align-items: center; gap: 8px;">
                <i class="${weatherInfo.iconClass} weather-icon"></i>
                <span class="condition-text">${weatherInfo.text}</span>
            </div>
            <div class="temp-range">
                <span class="temp-min">${min}°</span>
                <span style="margin: 0 8px;">-</span>
                <span class="temp-max">${max}°</span>
            </div>
        `;
        DOM.forecastContainer.appendChild(row);
    }
    
    const tmrwCondition = getWeatherDetails(daily.weather_code[1], true).text;
    DOM.advisoryText.innerHTML = `Expect <strong>${tmrwCondition.toLowerCase()}</strong> conditions tomorrow. Highs will reach ${Math.round(daily.temperature_2m_max[1])}°C.`;
}

// ==========================================================================
// 8. SAVED LOCATIONS LOGIC (LOCALSTORAGE)
// ==========================================================================
function toggleSavedCity(cityObj) {
    const existingIndex = state.savedCities.findIndex(c => c.name === cityObj.name);
    
    if (existingIndex >= 0) {
        state.savedCities.splice(existingIndex, 1);
        showToast("Removed from saved locations", "info");
    } else {
        state.savedCities.push(cityObj);
        showToast("Location saved successfully", "success");
    }
    
    localStorage.setItem('weatherPro_savedCities', JSON.stringify(state.savedCities));
    renderSavedCities();
    updateBookmarkStatus();
}

function renderSavedCities() {
    DOM.savedCitiesList.innerHTML = '';
    
    if (state.savedCities.length === 0) {
        DOM.savedCitiesList.innerHTML = '<li class="empty-saved-state" style="font-size: 0.85rem; color: #666;">No pinned locations yet</li>';
        return;
    }

    state.savedCities.forEach(city => {
        const li = document.createElement('li');
        li.className = 'saved-city-item';
        li.style.cursor = 'pointer';
        li.style.padding = '8px 0';
        li.innerHTML = `
            <span class="saved-city-name"><i class="fa-solid fa-map-pin" style="margin-right: 6px; color: var(--accent-primary);"></i> ${city.name.split(',')[0]}</span>
        `;
        
        li.addEventListener('click', () => {
            fetchDashboardData(city.lat, city.lon, city.name);
        });
        
        DOM.savedCitiesList.appendChild(li);
    });
}

function updateBookmarkStatus() {
    const isSaved = state.savedCities.some(c => c.name === state.currentLocation.name);
    if (isSaved) {
        DOM.bookmarkBtn.innerHTML = '<i class="fa-solid fa-bookmark" style="color: var(--accent-primary)"></i>';
    } else {
        DOM.bookmarkBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
    }
}

// ==========================================================================
// 9. UTILITY & HELPER FUNCTIONS
// ==========================================================================
function getWeatherDetails(code, isDay) {
    const weatherMap = {
        0: { text: 'Clear Sky', iconDay: 'fa-solid fa-sun', iconNight: 'fa-solid fa-moon' },
        1: { text: 'Mainly Clear', iconDay: 'fa-solid fa-cloud-sun', iconNight: 'fa-solid fa-cloud-moon' },
        2: { text: 'Partly Cloudy', iconDay: 'fa-solid fa-cloud-sun', iconNight: 'fa-solid fa-cloud-moon' },
        3: { text: 'Overcast', iconDay: 'fa-solid fa-cloud', iconNight: 'fa-solid fa-cloud' },
        45: { text: 'Fog', iconDay: 'fa-solid fa-smog', iconNight: 'fa-solid fa-smog' },
        48: { text: 'Depositing Rime Fog', iconDay: 'fa-solid fa-smog', iconNight: 'fa-solid fa-smog' },
        51: { text: 'Light Drizzle', iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain' },
        53: { text: 'Moderate Drizzle', iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain' },
        55: { text: 'Dense Drizzle', iconDay: 'fa-solid fa-cloud-showers-heavy', iconNight: 'fa-solid fa-cloud-showers-heavy' },
        61: { text: 'Slight Rain', iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain' },
        63: { text: 'Moderate Rain', iconDay: 'fa-solid fa-cloud-showers-heavy', iconNight: 'fa-solid fa-cloud-showers-heavy' },
        65: { text: 'Heavy Rain', iconDay: 'fa-solid fa-cloud-showers-water', iconNight: 'fa-solid fa-cloud-showers-water' },
        71: { text: 'Slight Snow', iconDay: 'fa-regular fa-snowflake', iconNight: 'fa-regular fa-snowflake' },
        73: { text: 'Moderate Snow', iconDay: 'fa-solid fa-snowflake', iconNight: 'fa-solid fa-snowflake' },
        75: { text: 'Heavy Snow', iconDay: 'fa-solid fa-icicles', iconNight: 'fa-solid fa-icicles' },
        95: { text: 'Thunderstorm', iconDay: 'fa-solid fa-cloud-bolt', iconNight: 'fa-solid fa-cloud-bolt' },
    };

    const details = weatherMap[code] || { text: 'Unknown', iconDay: 'fa-solid fa-cloud', iconNight: 'fa-solid fa-cloud' };
    return {
        text: details.text,
        iconClass: isDay ? details.iconDay : details.iconNight
    };
}

function formatTime(isoString) {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getWindDirection(degree) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
}

function getAQIStatus(aqi) {
    if (aqi <= 50) return { label: 'Good', color: '#10b981', advice: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
    if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', advice: 'Air quality is acceptable. However, there may be a risk for some people.' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316', advice: 'Members of sensitive groups may experience health effects.' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', advice: 'Some members of the general public may experience health effects.' };
    return { label: 'Very Unhealthy', color: '#8b5cf6', advice: 'Health alert: The risk of health effects is increased for everyone.' };
}

function getUVStatus(uv) {
    if (uv <= 2) return { label: 'Low', color: '#10b981', advice: 'No protection needed. You can safely stay outside.' };
    if (uv <= 5) return { label: 'Moderate', color: '#f59e0b', advice: 'Protection needed. Seek shade during late morning through mid-afternoon.' };
    if (uv <= 7) return { label: 'High', color: '#f97316', advice: 'Protection needed. Reduce time in the sun between 10 a.m. and 4 p.m.' };
    return { label: 'Very High', color: '#ef4444', advice: 'Extra protection needed. Be careful outside.' };
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span style="margin-left: 8px;">${message}</span>`;
    
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    toast.style.transition = 'opacity 0.3s ease';
    
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
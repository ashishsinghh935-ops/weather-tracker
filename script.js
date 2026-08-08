/**
 * WeatherPro - Professional Weather Dashboard Logic
 * Clean Slate Edition (Now with Chart.js)
 */

const state = {
    currentLocation: { name: "Delhi, India", lat: 28.6139, lon: 77.2090 },
    savedCities: JSON.parse(localStorage.getItem('weatherPro_savedCities')) || [],
    isFetching: false
};

// Global Integrations
let weatherMap = null;
let mapMarker = null;
let trendChart = null; // New Chart.js Instance

const DOM = {
    searchInput: document.getElementById('city-input'),
    suggestionsList: document.getElementById('suggestions-list'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    savedCitiesList: document.getElementById('saved-cities-list'),
    addFavoriteBtn: document.getElementById('add-favorite-btn'),
    bookmarkBtn: document.getElementById('bookmark-btn'),
    loadingState: document.getElementById('loading-state'),
    mainDashboard: document.getElementById('weather-display'),
    dashboardView: document.getElementById('dashboard-view'),
    mapSection: document.getElementById('weather-map-section'),
    aqiSection: document.getElementById('aqi-analytics-section'),
    refreshBtn: document.getElementById('refresh-data-btn'),
    toastContainer: document.getElementById('toast-container'),
    cityName: document.getElementById('city-name'),
    currentDate: document.getElementById('current-date'),
    lastUpdated: document.getElementById('last-updated-time'),
    aqiHeroBg: document.getElementById('aqi-hero-bg'),
    detAqiVal: document.getElementById('detailed-aqi-value'),
    detAqiStat: document.getElementById('detailed-aqi-status'),
    detAqiAdv: document.getElementById('detailed-aqi-advice'),
    temp: document.getElementById('temperature'),
    condition: document.getElementById('condition'),
    feelsLike: document.getElementById('feels-like-temp'),
    mainIcon: document.getElementById('main-weather-icon'),
    tempMax: document.getElementById('temp-max'),
    tempMin: document.getElementById('temp-min'),
    sunrise: document.getElementById('sunrise-time'),
    sunset: document.getElementById('sunset-time'),
    hourlyContainer: document.getElementById('hourly-container'),
    forecastContainer: document.getElementById('forecast-container'),
    advisoryText: document.getElementById('advisory-text'),
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
};

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderSavedCities();
    fetchDashboardData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
});

function setupEventListeners() {
    let searchTimeout;
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

    DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        DOM.clearSearchBtn.classList.add('hidden');
        DOM.suggestionsList.classList.add('hidden');
        DOM.searchInput.focus();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar-search')) DOM.suggestionsList.classList.add('hidden');
    });

    DOM.refreshBtn.addEventListener('click', () => {
        fetchDashboardData(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
        showToast("Refreshing live data...", "info");
    });

    const saveLocHandler = () => toggleSavedCity(state.currentLocation);
    DOM.bookmarkBtn.addEventListener('click', saveLocHandler);
    DOM.addFavoriteBtn.addEventListener('click', saveLocHandler);
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            e.currentTarget.parentElement.classList.add('active');
            
            const linkText = e.currentTarget.querySelector('span').textContent;
            
            DOM.dashboardView.classList.add('hidden');
            DOM.mapSection.classList.add('hidden');
            DOM.aqiSection.classList.add('hidden');
            
            if (linkText === 'Dashboard') {
                DOM.dashboardView.classList.remove('hidden');
            } else if (linkText === 'Weather Map') {
                DOM.mapSection.classList.remove('hidden');
                initMap(state.currentLocation.lat, state.currentLocation.lon, state.currentLocation.name);
                setTimeout(() => { if (weatherMap) weatherMap.invalidateSize(); }, 100);
            } else if (linkText === 'Air Quality Analytics') {
                DOM.aqiSection.classList.remove('hidden');
            }
        });
    });
}

function initMap(lat, lon, cityName) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    if (weatherMap) {
        weatherMap.setView([lat, lon], 10);
        if (mapMarker) mapMarker.setLatLng([lat, lon]).setPopupContent(`<b>${cityName}</b>`).openPopup();
        return;
    }
    weatherMap = L.map('map').setView([lat, lon], 10);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(weatherMap);
    mapMarker = L.marker([lat, lon]).addTo(weatherMap).bindPopup(`<b>${cityName}</b>`).openPopup();
}

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
    } catch (error) { console.error("Geocoding Error:", error); }
}

async function fetchDashboardData(lat, lon, cityName) {
    if (state.isFetching) return;
    state.isFetching = true;
    
    if (!DOM.dashboardView.classList.contains('hidden')) {
        DOM.mainDashboard.classList.add('hidden');
        DOM.loadingState.style.display = 'flex';
    }

    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,visibility,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

        const [weatherRes, aqiRes] = await Promise.all([ fetch(weatherUrl), fetch(aqiUrl) ]);
        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        state.currentLocation = { name: cityName, lat, lon };
        
        updateHeader(cityName);
        updateHeroSection(weatherData.current, weatherData.daily);
        updateHighlights(weatherData.current, weatherData.hourly, weatherData.daily, aqiData.current);
        updateHourlyForecast(weatherData.hourly);
        updateDailyForecast(weatherData.daily);
        updateDetailedAQI(aqiData.current);
        updateBookmarkStatus();
        
        if (weatherMap) initMap(lat, lon, cityName);

        DOM.loadingState.style.display = 'none';
        DOM.mainDashboard.classList.remove('hidden');

    } catch (error) {
        showToast("Failed to load data. Please check connection.", "error");
    } finally {
        state.isFetching = false;
    }
}

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
    DOM.currentDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    DOM.lastUpdated.innerHTML = `<i class="fa-regular fa-clock"></i> Updated ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
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
    DOM.visibility.textContent = (hourly.visibility[currentHour] / 1000).toFixed(1);
    DOM.visibilityStatus.textContent = (hourly.visibility[currentHour] / 1000) > 8 ? "Perfectly clear view." : "Visibility is reduced.";
}

function updateDetailedAQI(aqiData) {
    const aqi = aqiData.us_aqi || 0;
    const aqiInfo = getAQIStatus(aqi);
    
    DOM.detAqiVal.textContent = aqi;
    DOM.detAqiStat.textContent = aqiInfo.label;
    DOM.detAqiAdv.textContent = aqiInfo.advice;
    
    if(aqi <= 50) DOM.aqiHeroBg.style.background = 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
    else if(aqi <= 100) DOM.aqiHeroBg.style.background = 'linear-gradient(135deg, #b45309 0%, #d97706 100%)';
    else if(aqi <= 150) DOM.aqiHeroBg.style.background = 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)';
    else DOM.aqiHeroBg.style.background = 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)';

    const updatePollutant = (id, val, maxStandard) => {
        document.getElementById(`${id}-val`).innerHTML = `${val} <small>µg/m³</small>`;
        const bar = document.getElementById(`${id}-bar`);
        let percent = Math.min((val / maxStandard) * 100, 100);
        bar.style.width = `${percent}%`;
        
        if (percent < 30) bar.style.backgroundColor = '#10b981';
        else if (percent < 60) bar.style.backgroundColor = '#f59e0b';
        else if (percent < 85) bar.style.backgroundColor = '#f97316';
        else bar.style.backgroundColor = '#ef4444';
    };

    updatePollutant('pm25', Math.round(aqiData.pm2_5), 50);
    updatePollutant('pm10', Math.round(aqiData.pm10), 100);
    updatePollutant('no2', Math.round(aqiData.nitrogen_dioxide), 100);
    updatePollutant('o3', Math.round(aqiData.ozone), 150);
    updatePollutant('so2', Math.round(aqiData.sulphur_dioxide), 100);
    updatePollutant('co', Math.round(aqiData.carbon_monoxide), 5000);
}

function updateHourlyForecast(hourly) {
    DOM.hourlyContainer.innerHTML = '';
    const currentHourIdx = new Date().getHours();
    
    // Arrays for Chart.js
    const chartLabels = [];
    const chartData = [];
    
    for (let i = currentHourIdx; i < currentHourIdx + 24; i += 2) {
        const timeStr = new Date(hourly.time[i]).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const label = i === currentHourIdx ? 'Now' : timeStr;
        const temp = Math.round(hourly.temperature_2m[i]);
        const weatherInfo = getWeatherDetails(hourly.weather_code[i], true); 
        
        // Populate UI track
        DOM.hourlyContainer.innerHTML += `
            <div class="hourly-card">
                <p class="hourly-time">${label}</p>
                <i class="${weatherInfo.iconClass} hourly-icon" style="margin: 8px 0; font-size: 1.2rem;"></i>
                <p class="hourly-temp">${temp}°</p>
            </div>
        `;
        
        // Store data for the chart
        chartLabels.push(label);
        chartData.push(temp);
    }
    
    renderChart(chartLabels, chartData);
}

// NEW: Chart.js Rendering Logic
function renderChart(labels, data) {
    const canvas = document.getElementById('forecastChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Update existing chart to prevent flickering/overlap
    if (trendChart) {
        trendChart.data.labels = labels;
        trendChart.data.datasets[0].data = data;
        trendChart.update();
        return;
    }

    // Create a beautiful gradient fill beneath the line
    let gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)'); // brand color with opacity
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: data,
                borderColor: '#4f46e5',
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#4f46e5',
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true,
                tension: 0.4 // Makes the line smoothly curved
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) { return context.parsed.y + '°C'; }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { size: 11 } }
                },
                y: {
                    grid: { borderDash: [4, 4], color: '#e2e8f0' },
                    ticks: { 
                        color: '#64748b',
                        callback: function(value) { return value + '°'; }
                    }
                }
            }
        }
    });
}

function updateDailyForecast(daily) {
    DOM.forecastContainer.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
        const dayName = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short' });
        const weatherInfo = getWeatherDetails(daily.weather_code[i], true);
        const max = Math.round(daily.temperature_2m_max[i]);
        const min = Math.round(daily.temperature_2m_min[i]);
        DOM.forecastContainer.innerHTML += `
            <div class="forecast-row">
                <span class="day-name">${dayName}</span>
                <div class="forecast-condition-group" style="display: flex; align-items: center; gap: 8px;">
                    <i class="${weatherInfo.iconClass} weather-icon"></i> <span class="condition-text">${weatherInfo.text}</span>
                </div>
                <div class="temp-range">
                    <span class="temp-min">${min}°</span> <span style="margin: 0 8px;">-</span> <span class="temp-max">${max}°</span>
                </div>
            </div>
        `;
    }
    DOM.advisoryText.innerHTML = `Expect <strong>${getWeatherDetails(daily.weather_code[1], true).text.toLowerCase()}</strong> conditions tomorrow. Highs will reach ${Math.round(daily.temperature_2m_max[1])}°C.`;
}

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
        li.innerHTML = `<span class="saved-city-name"><i class="fa-solid fa-map-pin" style="margin-right: 6px; color: #4f46e5;"></i> ${city.name.split(',')[0]}</span>`;
        li.addEventListener('click', () => fetchDashboardData(city.lat, city.lon, city.name));
        DOM.savedCitiesList.appendChild(li);
    });
}

function updateBookmarkStatus() {
    DOM.bookmarkBtn.innerHTML = state.savedCities.some(c => c.name === state.currentLocation.name) 
        ? '<i class="fa-solid fa-bookmark" style="color: #4f46e5"></i>' 
        : '<i class="fa-regular fa-bookmark"></i>';
}

function getWeatherDetails(code, isDay) {
    const map = {
        0: { text: 'Clear Sky', iconDay: 'fa-solid fa-sun', iconNight: 'fa-solid fa-moon' },
        1: { text: 'Mainly Clear', iconDay: 'fa-solid fa-cloud-sun', iconNight: 'fa-solid fa-cloud-moon' },
        2: { text: 'Partly Cloudy', iconDay: 'fa-solid fa-cloud-sun', iconNight: 'fa-solid fa-cloud-moon' },
        3: { text: 'Overcast', iconDay: 'fa-solid fa-cloud', iconNight: 'fa-solid fa-cloud' },
        45: { text: 'Fog', iconDay: 'fa-solid fa-smog', iconNight: 'fa-solid fa-smog' },
        48: { text: 'Rime Fog', iconDay: 'fa-solid fa-smog', iconNight: 'fa-solid fa-smog' },
        51: { text: 'Light Drizzle', iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain' },
        61: { text: 'Slight Rain', iconDay: 'fa-solid fa-cloud-rain', iconNight: 'fa-solid fa-cloud-rain' },
        63: { text: 'Moderate Rain', iconDay: 'fa-solid fa-cloud-showers-heavy', iconNight: 'fa-solid fa-cloud-showers-heavy' },
        71: { text: 'Slight Snow', iconDay: 'fa-regular fa-snowflake', iconNight: 'fa-regular fa-snowflake' },
        95: { text: 'Thunderstorm', iconDay: 'fa-solid fa-cloud-bolt', iconNight: 'fa-solid fa-cloud-bolt' },
    };
    const details = map[code] || { text: 'Unknown', iconDay: 'fa-solid fa-cloud', iconNight: 'fa-solid fa-cloud' };
    return { text: details.text, iconClass: isDay ? details.iconDay : details.iconNight };
}

function formatTime(isoString) {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getWindDirection(degree) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8];
}

function getAQIStatus(aqi) {
    if (aqi <= 50) return { label: 'Good', color: '#10b981', advice: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
    if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b', advice: 'Air quality is acceptable. However, there may be a risk for some people.' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#f97316', advice: 'Members of sensitive groups may experience health effects.' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', advice: 'Some members of the general public may experience health effects.' };
    return { label: 'Very Unhealthy', color: '#8b5cf6', advice: 'Health alert: The risk of health effects is increased for everyone.' };
}

function getUVStatus(uv) {
    if (uv <= 2) return { label: 'Low', color: '#10b981', advice: 'No protection needed. You can safely stay outside.' };
    if (uv <= 5) return { label: 'Moderate', color: '#f59e0b', advice: 'Protection needed. Seek shade during late morning.' };
    if (uv <= 7) return { label: 'High', color: '#f97316', advice: 'Protection needed. Reduce time in the sun.' };
    return { label: 'Very High', color: '#ef4444', advice: 'Extra protection needed. Be careful outside.' };
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info');
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span style="margin-left: 8px;">${message}</span>`;
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background-color: #333; color: #fff; padding: 12px 24px; border-radius: 8px; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: opacity 0.3s ease;';
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}
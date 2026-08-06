// 1. Grab elements
const stateSelect = document.getElementById('state-select');
const citySelect = document.getElementById('city-select');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const aqi = document.getElementById('aqi');
const forecastContainer = document.getElementById('forecast-container');

// 2. State to City Dictionary
const locationData = {
    "Delhi": ["New Delhi"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Noida"]
};

// 3. Populate City Dropdown when State changes
stateSelect.addEventListener('change', () => {
    const selectedState = stateSelect.value;
    
    // Clear out old city options
    citySelect.innerHTML = '<option value="">Select a City...</option>';
    
    if (selectedState === "") {
        citySelect.disabled = true;
    } else {
        citySelect.disabled = false;
        // Load the new cities
        const cities = locationData[selectedState];
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
});

// Helper: Convert weather codes to text
function getWeatherCondition(code) {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
}

// Helper: Format date string (e.g., "2026-08-07" to "Aug 7")
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// 4. Handle the Search Click
searchBtn.addEventListener('click', async () => {
    const city = citySelect.value;
    
    if (city === '') {
        alert('Please select both a state and a city!');
        return;
    }

    try {
        // Step 1: Geocoding
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results) {
            alert('Location data not found.');
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];
        cityName.textContent = `${name}, ${stateSelect.value}`;

        // Step 2: Fetch Current AND 5-Day Daily Weather
        // Notice the new "&daily=" parameters added to the URL!
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherResponse.json();
        
        const current = weatherData.current;
        const daily = weatherData.daily;

        // Update Current Weather UI
        temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
        condition.textContent = getWeatherCondition(current.weather_code);
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

        // Step 3: Fetch Air Quality
        const aqiResponse = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`);
        const aqiData = await aqiResponse.json();
        aqi.textContent = aqiData.current.us_aqi || "--";

        // Step 4: Generate 5-Day Forecast Cards
        forecastContainer.innerHTML = ''; // Clear previous forecast
        
        // Loop through the next 5 days (skipping index 0, which is today)
        for (let i = 1; i <= 5; i++) {
            const dateStr = daily.time[i];
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const weatherCode = daily.weather_code[i];

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <p class="date">${formatDate(dateStr)}</p>
                <p class="temp">${maxTemp}° / ${minTemp}°</p>
                <p style="font-size: 0.75rem; color: #7f8c8d;">${getWeatherCondition(weatherCode)}</p>
            `;
            forecastContainer.appendChild(card);
        }

        // Show UI
        weatherDisplay.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert('Error fetching weather data.');
    }
});
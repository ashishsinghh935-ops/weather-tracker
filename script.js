// 1. Grab all the elements from our HTML
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const aqi = document.getElementById('aqi');

// Helper function to convert Open-Meteo numeric weather codes into text
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

// 2. Listen for a click on the search button
searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    
    if (city === '') {
        alert('Please enter a city name!');
        return;
    }

    try {
        // Step 1: Geocoding (Convert city name to Latitude & Longitude)
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&format=json`);
        const geoData = await geoResponse.json();

        // Check if the API found the city
        if (!geoData.results || geoData.results.length === 0) {
            alert('City not found. Please try again!');
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        cityName.textContent = `${name}, ${country}`;

        // Step 2: Fetch Current Weather Data
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
        condition.textContent = getWeatherCondition(current.weather_code);
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

        // Step 3: Fetch Air Quality Data (US AQI)
        const aqiResponse = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`);
        const aqiData = await aqiResponse.json();

        aqi.textContent = aqiData.current.us_aqi;

        // Show the weather card on the screen
        weatherDisplay.classList.remove('hidden');
        cityInput.value = '';

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Something went wrong while fetching the live weather data.');
    }
});
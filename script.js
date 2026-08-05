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

// 2. Listen for a click on the search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    
    // Check if the user left the input blank
    if (city.trim() === '') {
        alert('Please enter a city name!');
        return;
    }

    // 3. Simulate fetching data from a weather API 
    // (We can replace this with a real API like OpenWeatherMap later!)
    cityName.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    
    // Generate random but realistic weather numbers for testing
    temperature.textContent = Math.floor(Math.random() * 15 + 20) + '°C'; 
    condition.textContent = 'Partly Cloudy';
    humidity.textContent = Math.floor(Math.random() * 30 + 40) + '%';
    windSpeed.textContent = Math.floor(Math.random() * 15 + 5) + ' km/h';
    aqi.textContent = Math.floor(Math.random() * 100 + 40);

    // 4. Remove the 'hidden' class to show the weather card
    weatherDisplay.classList.remove('hidden');
    
    // Clear the input box
    cityInput.value = '';
});
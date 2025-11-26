let map;
let marker;

// Load default map when page opens
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
}

// Update map when city weather is loaded
function updateMap(lat, lon, city) {
    const location = [lat, lon];

    map.setView(location, 10);

    if (marker) marker.remove();

    marker = L.marker(location).addTo(map)
        .bindPopup(`📍 ${city}`)
        .openPopup();
}

// Weather Search Function
async function searchCity() {
    const city = document.getElementById("city").value;
    const API_KEY = "1454afb585d32d999e715b5c15b1524c";

    document.getElementById("output").innerText = "Loading...";

    // Get City Coordinates
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (geoData.length === 0) {
        document.getElementById("output").innerText = "City not found!";
        return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // Get Weather
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    // Display
    document.getElementById("output").innerText =
        `City: ${weatherData.name}\n` +
        `Temperature: ${weatherData.main.temp} °C\n` +
        `Humidity: ${weatherData.main.humidity}%\n` +
        `Wind: ${weatherData.wind.speed} m/s\n` +
        `Weather: ${weatherData.weather[0].description}`;

    // Update Map
    updateMap(lat, lon, weatherData.name);
}

// Initialize map on page load
window.onload = initMap;

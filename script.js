const cityInput = document.getElementById("cityInput");
const errorMessage = document.getElementById("errorMessage");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  try {
    errorMessage.textContent = "";
    weatherCard.style.display = "none";

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError("City not found. Try another city.");
      return;
    }

    const location = geoData.results[0];
    const latitude = location.latitude;
    const longitude = location.longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    displayWeather(location, weatherData.current);
  } catch (error) {
    showError("Something went wrong. Please try again later.");
  }
}

function displayWeather(location, currentWeather) {
  cityName.textContent = `${location.name}, ${location.country}`;
  temperature.textContent = `${Math.round(currentWeather.temperature_2m)}°F`;
  condition.textContent = getWeatherDescription(currentWeather.weather_code);
  wind.textContent = `${currentWeather.wind_speed_10m} mph`;
  humidity.textContent = `${currentWeather.relative_humidity_2m}%`;

  weatherCard.style.display = "block";
}

function showError(message) {
  errorMessage.textContent = message;
  weatherCard.style.display = "none";
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Cloudy",
    45: "Foggy",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Light rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    95: "Thunderstorm"
  };

  return weatherCodes[code] || "Weather information";
}

cityInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

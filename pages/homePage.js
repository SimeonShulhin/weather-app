import { fetchWeather } from '../services/api.js';
import { drawWeatherForecast } from '../helpers/drawChart.js';
import { showLoader } from '../components/loader.js';
import {
  addWeatherBlock,
  showRemoveModal,
  toggleFavorite,
  addWeatherInfo,
} from '../components/weatherCard.js';

export async function initHomePage() {
  document.getElementById('add-block').addEventListener('click', addWeatherBlock);

  const weatherCard = document.querySelector('.weather-card');
  weatherCard
    .querySelector('.remove-block')
    .addEventListener('click', () => showRemoveModal(weatherCard));
  weatherCard
    .querySelector('.favorite-block')
    .addEventListener('click', () => toggleFavorite(weatherCard));

  const radios = weatherCard.querySelectorAll('input[name="period"]');
  radios.forEach((radio) => {
    radio.addEventListener('change', async function () {
      const cityInput = weatherCard.querySelector('.city-input');
      if (cityInput.dataset.lat) {
        showLoader(weatherCard);
        const data = await fetchWeather({ lat: cityInput.dataset.lat, lon: cityInput.dataset.lon });
        addWeatherInfo({
          block: weatherCard,
          name: cityInput.dataset.name,
          description: data.current.weather[0].description,
          temp: Math.round(data.current.temp),
        });
        drawWeatherForecast(data, weatherCard, radio.value);
        showLoader(weatherCard, false);
      }
    });
  });

  showLoader(weatherCard);
  weatherCard.dataset.id = new Date().getTime();
  await displayUserWeather(weatherCard);
  showLoader(weatherCard, false);
}

async function displayUserWeather(weatherCard) {
  try {
    const locationResponse = await fetch('https://ipinfo.io/json?token=9ec54c8afb7bfa');
    const locationData = await locationResponse.json();
    const [lat, lon] = locationData.loc.split(',');

    const weatherData = await fetchWeather({ lat, lon });
    const cityName = locationData.city;

    const cityInput = weatherCard.querySelector('.city-input');
    cityInput.value = cityName;
    cityInput.dataset.lat = lat;
    cityInput.dataset.lon = lon;
    cityInput.dataset.name = cityName;

    addWeatherInfo({
      block: weatherCard,
      name: cityName,
      description: weatherData.current.weather[0].description,
      temp: Math.round(weatherData.current.temp),
    });

    drawWeatherForecast(weatherData, weatherCard, 'day');
  } catch (error) {
    console.error('Error fetching user location or weather data:', error);
  }
}

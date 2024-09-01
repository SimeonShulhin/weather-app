// favoritesPage.js
import { fetchWeather } from '../services/api.js';
import { drawWeatherForecast } from '../helpers/drawChart.js';
import { showLoader } from '../components/loader.js';
import { addWeatherInfo, toggleFavorite } from '../components/weatherCard.js';
import { getTranslation as t } from '../localization/index.js';

export let favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];

export function initFavoritesPage() {
  updateFavoritesContainer();
}

export function updateFavoritesContainer() {
  const container = document.getElementById('favorites-container');
  container.innerHTML = '';

  favoriteCities.forEach(async ({ name, coord }, i) => {
    const block = document.createElement('div');
    block.className = 'weather-card favorite';
    block.dataset.id = new Date().getTime() + i + 1;
    block.innerHTML = `
      <input class="city-input hidden" data-name="${name}"/>
      <div style="text-align: right;">
      <button class="favorite-block icon">🌟</button>
      </div>
      <div class="weather-info"></div>
      <div class="loader hidden"></div>
      <fieldset>
        <legend data-local="selectPeriod">${t('selectPeriod')}</legend>
        <div>
          <input type="radio" id="day-${i}" name="period-${i}" value="day" checked />
          <label for="day-${i}" data-local="day">${t('day')}</label>
        </div>
        <div>
          <input type="radio" id="week-${i}" name="period-${i}" value="week" />
          <label for="week-${i}" data-local="week">${t('week')}</label>
        </div>
      </fieldset>
      <canvas class="weather-chart"></canvas>
    `;
    container.appendChild(block);
    const data = await fetchWeather({ lat: coord.lat, lon: coord.lon });
    addWeatherInfo({
      block,
      name,
      description: data.current.weather[0].description,
      temp: Math.round(data.current.temp),
    });
    drawWeatherForecast(data, block, 'day');

    block.querySelector('.favorite-block').addEventListener('click', () => toggleFavorite(block));

    const radios = block.querySelectorAll('input[name^="period"]');
    radios.forEach((radio) => {
      radio.addEventListener('change', async function () {
        if (coord.lat) {
          showLoader(block);
          const data = await fetchWeather({ lat: coord.lat, lon: coord.lon });
          drawWeatherForecast(data, block, radio.value);
          showLoader(block, false);
        }
      });
    });
  });
}

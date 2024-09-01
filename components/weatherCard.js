import { fetchWeather, fetchCitySuggestions } from '../services/api.js';
import { drawWeatherForecast } from '../helpers/drawChart.js';
import { favoriteCities, updateFavoritesContainer } from '../pages/favoritesPage.js';
import { showLoader } from './loader.js';
import { getTranslation as t } from '../localization/index.js';

const maxBlocks = 5;
export let blockToRemove = null;
let weatherBlocks = [document.querySelector('.weather-card')];

export function addWeatherBlock() {
  if (weatherBlocks.length >= maxBlocks) {
    alert('Maximum 5 blocks allowed');
    return;
  }

  const block = document.createElement('div');
  block.className = 'weather-card';
  block.dataset.id = new Date().getTime();
  block.innerHTML = `
    <div class="weather-card-header">
      <div class="input-container">
        <div class="search-input">
          <span class="search-icon">🔍</span>
          <input
            type="search"
            class="city-input"
            oninput="onInput(event)"
          />
        </div>
        <div class="autocomplete-list"></div>
      </div>
      <div>
        <button class="remove-block icon">🗑️</button>
        <button class="favorite-block icon">⭐</button>
      </div>
    </div>
    <div class="weather-info"></div>
    <div class="loader hidden"></div>
    <fieldset>
      <legend data-local="selectPeriod">${t('selectPeriod')}</legend>
      <div>
        <input type="radio" id="day-${block.dataset.id}" name="period-${
    block.dataset.id
  }" value="day" checked />
        <label for="day-${block.dataset.id}" data-local="day">${t('day')}</label>
      </div>
      <div>
        <input type="radio" id="week-${block.dataset.id}" name="period-${
    block.dataset.id
  }" value="week" />
        <label for="week-${block.dataset.id}" data-local="week">${t('week')}</label>
      </div>
    </fieldset>
    <canvas class="weather-chart"></canvas>
  `;

  document
    .getElementById('weather-container')
    .insertBefore(block, document.querySelector('.add-block-container'));
  weatherBlocks.push(block);

  const cityInput = block.querySelector('.city-input');

  block.querySelector('.remove-block').addEventListener('click', () => showRemoveModal(block));
  block.querySelector('.favorite-block').addEventListener('click', () => toggleFavorite(block));
  const radios = block.querySelectorAll('input[name^="period"]');
  radios.forEach((radio) => {
    radio.addEventListener('change', async function () {
      if (cityInput.dataset.name) {
        showLoader(block);
        const data = await fetchWeather({ lat: cityInput.dataset.lat, lon: cityInput.dataset.lon });
        drawWeatherForecast(data, block, radio.value);
        showLoader(block, false);
      }
    });
  });
}

export function removeWeatherBlock(block) {
  block.remove();
  weatherBlocks = weatherBlocks.filter((b) => b !== block);
}

export function showRemoveModal(block) {
  blockToRemove = block;
  document.getElementById('modal').style.display = 'flex';
}

export function toggleFavorite(block) {
  const city = block.querySelector('.city-input');

  if (!city.dataset.name) return;

  const favoriteCityIndex = favoriteCities.findIndex(({ name }) => name === city.dataset.name);

  if (favoriteCityIndex !== -1) {
    favoriteCities.splice(favoriteCityIndex, 1);
    updateFavorite(false, block);
  } else {
    if (favoriteCities.length >= 5) {
      alert('To add a new favorite city, remove an existing one');
      return;
    }
    favoriteCities.push({
      name: city.dataset.name,
      coord: {
        lat: city.dataset.lat,
        lon: city.dataset.lon,
      },
    });
    updateFavorite(true, block);
  }

  localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
  updateFavoritesContainer(favoriteCities);
}

function showAutocompleteSuggestions(input, suggestions) {
  const period = document.querySelector('input[name="period"]:checked').value;
  let autocompleteList = input.nextElementSibling;
  if (!autocompleteList || !autocompleteList.classList.contains('autocomplete-list')) {
    autocompleteList = document.createElement('div');
    autocompleteList.className = 'autocomplete-list';
    input.parentNode.insertBefore(autocompleteList, input.nextSibling);
  }

  autocompleteList.innerHTML = '';
  suggestions.forEach((suggestion) => {
    const item = document.createElement('div');
    const { name, sys, coord } = suggestion;
    const itemName = `${name}, ${sys.country}`;
    item.className = 'autocomplete-item';
    item.textContent = itemName;

    item.addEventListener('click', async () => {
      input.value = name;
      input.dataset.lat = coord.lat;
      input.dataset.lon = coord.lon;
      input.dataset.name = itemName;
      autocompleteList.innerHTML = '';

      const weatherCard = input.closest('.weather-card');
      const favoriteCityIndex = favoriteCities.findIndex(
        (city) => +city.coord.lat === coord.lat && +city.coord.lon === coord.lon
      );

      favoriteCityIndex === -1
        ? updateFavorite(false, weatherCard)
        : updateFavorite(true, weatherCard);
      showLoader(weatherCard);
      const data = await fetchWeather({ lat: coord.lat, lon: coord.lon });
      addWeatherInfo({
        block: weatherCard,
        name: itemName,
        description: data.current.weather[0].description,
        temp: Math.round(data.current.temp),
      });
      drawWeatherForecast(data, weatherCard, period);
      showLoader(weatherCard, false);
    });
    autocompleteList.appendChild(item);
  });
}

export function addWeatherInfo({ block, name, description, temp }) {
  block.querySelector('.weather-info').innerHTML = `
    <h2>${name}</h2>
    <p>${description}</p>
    <p>${temp}°C</p>
  `;
}

async function onInput(e) {
  const suggestions = await fetchCitySuggestions(e.target.value);
  showAutocompleteSuggestions(e.target, suggestions);
}

function updateFavorite(bool, block) {
  const favoriteButton = block.querySelector('.favorite-block');

  if (bool) {
    block.classList.add('favorite');
    favoriteButton.textContent = '🌟';
  } else {
    block.classList.remove('favorite');
    favoriteButton.textContent = '⭐';
  }
}

window.onInput = onInput;

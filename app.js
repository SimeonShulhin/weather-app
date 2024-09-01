import { initHomePage } from './pages/homePage.js';
import { initFavoritesPage } from './pages/favoritesPage.js';
import { setLanguage } from './localization/index.js';

export const languageSelect = document.getElementById('language-select');

languageSelect.addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

document.getElementById('weather-tab').addEventListener('click', showWeatherTab);
function showWeatherTab() {
  document.getElementById('weather-container').classList.remove('hidden');
  document.getElementById('favorites-container').classList.add('hidden');
}

document.getElementById('favorites-tab').addEventListener('click', showFavoritesTab);
function showFavoritesTab() {
  document.getElementById('weather-container').classList.add('hidden');
  document.getElementById('favorites-container').classList.remove('hidden');
}

initHomePage();
initFavoritesPage();

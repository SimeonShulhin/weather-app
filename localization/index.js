import { languageSelect } from '../app.js';
import { translations } from './translations.js';

export let currentLanguage = localStorage.getItem('lang') || 'en';

export function setLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('lang', language);
  updateInterfaceLanguage();
}

export function getTranslation(key) {
  return translations[currentLanguage][key] || key;
}

function updateInterfaceLanguage() {
  document.querySelectorAll('[data-local]').forEach((element) => {
    const key = element.getAttribute('data-local');
    element.textContent = getTranslation(key);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  languageSelect.value = currentLanguage;
  updateInterfaceLanguage();
});

import { currentLanguage } from '../localization/index.js';
const apiKey = '5796abbde9106b7da4febfae8c44c232';

export async function fetchCitySuggestions(query) {
  if (query.length < 3) return [];

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}&lang=${currentLanguage}`
  );
  const data = await response.json();

  return data.list.map((city) => ({ name: city.name, coord: city.coord, sys: city.sys }));
}

export async function fetchWeather({ lat, lon }) {
  if (!lat || !lon) return;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${currentLanguage}`
  );
  const data = await response.json();

  return data;
}

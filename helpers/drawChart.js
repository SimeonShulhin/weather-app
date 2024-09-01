import { currentLanguage, getTranslation } from '../localization/index.js';

const chartInstances = new Map();

export function drawWeatherForecast(city, block, view) {
  const cardId = block.dataset.id;

  if (chartInstances.has(cardId)) {
    chartInstances.get(cardId).destroy();
  }

  const labels =
    view === 'day'
      ? city.hourly.slice(0, 8).map((item) => new Date(item.dt * 1000).getHours() + ':00')
      : city.daily.map((item) =>
          new Date(item.dt * 1000).toLocaleDateString(currentLanguage, { weekday: 'short' })
        );
  const temps =
    view === 'day'
      ? city.hourly.slice(0, 8).map((item) => Math.round(item.temp))
      : city.daily.map((item) => Math.round(item.temp.day));

  const ctx = block.querySelector('.weather-chart').getContext('2d');

  const newChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: getTranslation('temperature'),
          data: temps,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  chartInstances.set(cardId, newChart);
}

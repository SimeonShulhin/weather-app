export function showLoader(block, toShow = true) {
  const loader = block.querySelector('.loader');
  const weatherInfo = block.querySelector('.weather-info');
  const weatherChart = block.querySelector('.weather-chart');

  if (toShow) {
    loader.classList.remove('hidden');
    weatherInfo.classList.add('blured');
    weatherChart.classList.add('blured');
  } else {
    loader.classList.add('hidden');
    weatherInfo.classList.remove('blured');
    weatherChart.classList.remove('blured');
  }
}

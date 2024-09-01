import { blockToRemove, removeWeatherBlock } from './weatherCard.js';

document.getElementById('confirm-remove').addEventListener('click', confirmRemoveBlock);
function confirmRemoveBlock() {
  if (blockToRemove) {
    removeWeatherBlock(blockToRemove);
  }
  hideModal();
}

document.getElementById('cancel-remove').addEventListener('click', cancelRemoveBlock);
function cancelRemoveBlock() {
  hideModal();
}

function hideModal() {
  document.getElementById('modal').style.display = 'none';
}

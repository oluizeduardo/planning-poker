/* eslint-disable max-len */
const checkDarkMode = document.getElementById('checkDarkMode');
const headerElement = document.getElementById('el_header');
const roomName = document.getElementById('room-name');
const cards = document.querySelectorAll('.card');
const centerIcons = document.querySelectorAll('.center-icon');
const listGroupItens = document.querySelectorAll('.list-group-item');

const SESSION_STORAGE_NAME = 'backgroundMode';

const backgroundMode = getBackgroundMode();

if (backgroundMode) {
  document.body.classList.toggle('dark', backgroundMode === 'dark');
  headerElement.classList.toggle('bg-light', backgroundMode === 'light');
  headerElement.classList.toggle('bg-dark-theme-light', backgroundMode === 'dark');
  roomName.classList.toggle('text-white', backgroundMode === 'dark');

  cards.forEach((item) => {
    item.classList.toggle('bg-dark-theme-light', backgroundMode === 'dark');
  });
  centerIcons.forEach((item) => {
    item.classList.toggle('text-muted', backgroundMode === 'dark');
  });
  listGroupItens.forEach((item) => {
    item.classList.toggle('bg-dark-theme-light', backgroundMode === 'dark');
  });

  if (backgroundMode === 'dark') {
    checkDarkMode.checked = true;
  }
}

checkDarkMode.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  headerElement.classList.toggle('bg-light');
  headerElement.classList.toggle('bg-dark-theme-light');
  roomName.classList.toggle('text-white');

  cards.forEach((item) => {
    item.classList.toggle('bg-dark-theme-light');
  });
  centerIcons.forEach((item) => {
    item.classList.toggle('text-muted');
  });
  listGroupItens.forEach((item) => {
    item.classList.toggle('bg-dark-theme-light');
  });

  const newMode = document.body.classList.contains('dark') ? 'dark' : 'light';
  setBackgroundMode(newMode);
});

/**
 * Retrieves the background mode from sessionStorage.
 * @return {string | null} The background mode stored in sessionStorage.
 *                          Returns `null` if the background mode is not set.
 */
function getBackgroundMode() {
  return sessionStorage.getItem(SESSION_STORAGE_NAME);
}

/**
 * Sets the background mode in sessionStorage.
 *
 * @function
 * @param {string} newMode - The new background mode to be set.
 * @return {void}
 */
function setBackgroundMode(newMode) {
  sessionStorage.setItem(SESSION_STORAGE_NAME, newMode);
}

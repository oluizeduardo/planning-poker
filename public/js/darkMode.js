/* eslint-disable max-len */
const checkDarkMode = document.getElementById('checkDarkMode');
const headerElement = document.getElementById('el_header');
const roomName = document.getElementById('room-name');
const cards = document.querySelectorAll('.card');
const leftIcons = document.querySelectorAll('.card-left-icon');
const centerIcons = document.querySelectorAll('.card-center-icon');
const rightIcons = document.querySelectorAll('.card-right-icon');

const SESSION_STORAGE_NAME = 'backgroundMode';
const BACKGROUND_MODE_DARK = 'dark';
const BACKGROUND_MODE_LIGHT = 'light';

const CLASS_TEXT_WHITE = 'text-white';
const CLASS_DARK = 'dark';
const CLASS_BG_LIGHT = 'bg-light';
const CLASS_BG_DARK_THEME_LIGHT = 'bg-dark-theme-light';
const CLASS_WHITE_SHADOW = 'white-shadow';

const backgroundMode = getBackgroundMode();

if (backgroundMode) {
  document.body.classList.toggle(
    CLASS_DARK,
    backgroundMode === BACKGROUND_MODE_DARK,
  );
  headerElement.classList.toggle(
    CLASS_BG_LIGHT,
    backgroundMode === BACKGROUND_MODE_LIGHT,
  );
  headerElement.classList.toggle(
    CLASS_BG_DARK_THEME_LIGHT,
    backgroundMode === BACKGROUND_MODE_DARK,
  );
  roomName.classList.toggle(
    CLASS_TEXT_WHITE,
    backgroundMode === BACKGROUND_MODE_DARK,
  );

  cards.forEach((item) => {
    item.classList.toggle(
      CLASS_BG_DARK_THEME_LIGHT,
      backgroundMode === BACKGROUND_MODE_DARK,
    );
    item.classList.toggle(
      CLASS_WHITE_SHADOW,
      backgroundMode === BACKGROUND_MODE_DARK,
    );
  });
  leftIcons.forEach((item) => {
    item.classList.toggle(
      CLASS_TEXT_WHITE,
      backgroundMode === BACKGROUND_MODE_DARK,
    );
  });
  centerIcons.forEach((item) => {
    item.classList.toggle(
      CLASS_TEXT_WHITE,
      backgroundMode === BACKGROUND_MODE_DARK,
    );
  });
  rightIcons.forEach((item) => {
    item.classList.toggle(
      CLASS_TEXT_WHITE,
      backgroundMode === BACKGROUND_MODE_DARK,
    );
  });

  document.querySelectorAll('.list-group-item').forEach((item) => {
    item.classList.toggle(
      CLASS_BG_DARK_THEME_LIGHT,
      backgroundMode === BACKGROUND_MODE_DARK,
    );
  });

  if (backgroundMode === BACKGROUND_MODE_DARK) {
    checkDarkMode.checked = true;
  }
}

checkDarkMode.addEventListener('change', () => {
  document.body.classList.toggle(CLASS_DARK);
  headerElement.classList.toggle(CLASS_BG_LIGHT);
  headerElement.classList.toggle(CLASS_BG_DARK_THEME_LIGHT);
  roomName.classList.toggle(CLASS_TEXT_WHITE);

  // //////////
  // CARDS
  // //////////
  cards.forEach((item) => {
    item.classList.toggle(CLASS_BG_DARK_THEME_LIGHT);
    item.classList.toggle(CLASS_WHITE_SHADOW);
  });
  leftIcons.forEach((item) => {
    item.classList.toggle(CLASS_TEXT_WHITE);
  });
  centerIcons.forEach((item) => {
    item.classList.toggle(CLASS_TEXT_WHITE);
  });
  rightIcons.forEach((item) => {
    item.classList.toggle(CLASS_TEXT_WHITE);
  });

  // //////////
  // MENU ITENS
  // //////////
  changeBackgroundThemeMenuItems();

  const newMode = document.body.classList.contains(CLASS_DARK) ?
    BACKGROUND_MODE_DARK :
    BACKGROUND_MODE_LIGHT;
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

/**
 * Changes the background theme of menu items in a list group
 * by toggling the 'bg-dark-theme-light' class.
 * @return {void}
 */
function changeBackgroundThemeMenuItems() {
  const groupItens = document.querySelectorAll('.list-group-item');
  const playersNames = document.querySelectorAll('.list-item-player-name');

  groupItens.forEach((item) => {
    item.classList.toggle(CLASS_BG_DARK_THEME_LIGHT);
  });
  playersNames.forEach((item) => {
    item.classList.toggle(CLASS_TEXT_WHITE);
  });
}

export {
  getBackgroundMode,
  BACKGROUND_MODE_DARK,
  CLASS_TEXT_WHITE,
  CLASS_BG_DARK_THEME_LIGHT,
};

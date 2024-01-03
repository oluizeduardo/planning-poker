/* eslint-disable max-len */
import {getUserData, saveUserData} from './userSessionStorage.js';

const pnBtnReviewEstimates = document.getElementById('pnBtnReviewEstimates');
const btnStartModerating = document.getElementById('btnStartModerating');

btnStartModerating.addEventListener('click', () => {
  const user = getUserData();
  changeTextInMenuItem();
  changePanelVisibility();
  showVideoGameControlIcon(user.userId);
  updateUserDataSessionStorage(user);
});

/**
 * Changes the text content of a menu item button between
 * 'Start Moderating' and 'Stop Moderating'.
 * @return {void}
 */
function changeTextInMenuItem() {
  const buttonText = btnStartModerating.innerText;
  const newText =
    buttonText === 'Start Moderating' ? 'Stop Moderating' : 'Start Moderating';
  btnStartModerating.innerText = newText;
}

/**
 * Toggles the visibility of a panel button with the class 'invisible'.
 * @return {void}
 */
function changePanelVisibility() {
  pnBtnReviewEstimates.classList.toggle('invisible');
}

/**
 * Toggles the visibility of a video game control icon
 * within a menu item based on the user ID.
 *
 * @param {string} userId - The unique identifier of the user
 * associated with the menu item.
 * @return {void}
 */
function showVideoGameControlIcon(userId) {
  if (userId) {
    const menuItem = document.getElementById(userId);
    const span = menuItem.querySelector('span');
    span.classList.toggle('invisible');
  }
}

/**
 * Updates user data, toggles the 'isModerator' property,
 * and saves the updated data to sessionStorage.
 *
 * @param {Object} user - The user data object to be updated.
 * @return {void}
 */
function updateUserDataSessionStorage(user) {
  const updatedUser = {
    ...user,
    isModerator: !user.isModerator,
  };
  saveUserData(updatedUser);
}

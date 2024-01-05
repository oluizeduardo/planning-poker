/* eslint-disable max-len */
import {emitUpdateUserModeratorStatus} from './socket-front-game.js';
import {getUserData, saveUserData} from './userSessionStorage.js';

const pnBtnReviewEstimates = document.getElementById('pnBtnReviewEstimates');
const btnStartStopModerating = document.getElementById('btnStartModerating');

btnStartStopModerating.addEventListener('click', () => {
  const user = getUserData();
  changeTextInMenuItem();
  changePanelVisibility();
  const updatedUser = {
    ...user,
    isModerator: !user.isModerator,
  };
  saveUserData(updatedUser);
  emitUpdateUserModeratorStatus(updatedUser);
});

/**
 * Changes the text content of a menu item/button and toggles between
 * 'Start Moderating' and 'Stop Moderating' if no new text is provided.
 *
 * @param {string} [newText] - The new text to set for the menu item/button.
 *                             If not provided, toggles between 'Start Moderating'
 *                             and 'Stop Moderating'.
 * @return {void}
 */
function changeTextInMenuItem(newText) {
  const buttonText = btnStartModerating.innerText;
  if (!newText) {
    newText =
    buttonText === 'Start Moderating' ? 'Stop Moderating' : 'Start Moderating';
  }
  btnStartModerating.innerText = newText;
}

/**
 * Toggles the visibility of a panel button with the class 'invisible'.
 * @return {void}
 */
function changePanelVisibility() {
  pnBtnReviewEstimates.classList.toggle('invisible');
}

export {
  changeTextInMenuItem,
  changePanelVisibility,
};

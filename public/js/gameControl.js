/* eslint-disable max-len */
import {printRoomName} from './game.js';
import {
  emitGetFinalAverage,
  emitRestartGame,
  emitUpdateRoomName,
  emitUpdateUserModeratorStatus,
} from './socket-front-game.js';
import {getUserData, saveUserData} from './userSessionStorage.js';

const pnButtonsGameController = document.getElementById('panel-base-buttons-game-controller');
const btnStartStopModerating = document.getElementById('btnStartModerating');
const btnEditRoomName = document.getElementById('btnEditRoomName');
const btnReviewEstimates = document.getElementById('btnReviewEstimates');
const btnRestartGame = document.getElementById('btnRestartGame');
const panelBaseCards = document.getElementById('panel-base-cards');
const panelBaseChart = document.getElementById('panel-base-chart');

// /////////////////////////////
// Start/Stop Moderating
// /////////////////////////////
btnStartStopModerating.addEventListener('click', () => {
  const user = getUserData();
  changeTextInMenuItem();
  changePanelVisibility();
  changeEditRoomNameVisibility();
  const updatedUser = {
    ...user,
    isModerator: !user.isModerator,
  };
  saveUserData(updatedUser);
  emitUpdateUserModeratorStatus(updatedUser);
});

// /////////////////////////////
// Edit room's name
// /////////////////////////////
btnEditRoomName.addEventListener('click', () => {
  askForRoomName()
    .then((newRoomName) => {
      if (newRoomName) {
        const userData = getUserData();
        const {roomId} = userData;
        const updateRoomNameObject = {roomId, newRoomName};
        emitUpdateRoomName(updateRoomNameObject);
        saveUserData({...userData, roomName: newRoomName});
        printRoomName(newRoomName);
      }
    })
    .catch((error) => {
      console.error('An error occurred while updating the room\'s name:', error);
    });
});

// /////////////////////////////
// Review Estimates
// /////////////////////////////
btnReviewEstimates.addEventListener('click', () => {
  panelBaseCards.style.display = 'none';
  panelBaseChart.style.display = 'flex';

  const {roomId} = getUserData();
  emitGetFinalAverage(roomId);
});

// /////////////////////////////
// Restart Game
// /////////////////////////////
btnRestartGame.addEventListener('click', () => {
  panelBaseChart.style.display = 'none';
  panelBaseCards.style.display = 'flex';

  const {roomId} = getUserData();
  emitRestartGame(roomId);
});

/**
 * Displays a SweetAlert prompt to ask the user for a room's name.
 *
 * @return {Promise<string|null>} A Promise that resolves to the trimmed room name if confirmed,
 *                               or null if canceled or an error occurred.
 *
 * @throws {Error} If an error occurs during the SweetAlert prompt.
 */
function askForRoomName() {
  return swal({
    title: 'Change room\'s name',
    text: 'All players will be notified about this action.',
    closeOnClickOutside: true,
    closeOnEsc: true,
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type the room\'s name',
      },
    },
    buttons: {
      cancel: {
        text: 'Cancel',
        value: null,
        visible: true,
        closeModal: true,
      },
      confirm: {
        text: 'Confirm',
        value: true,
        visible: true,
        closeModal: true,
      },
    },
  })
    .then((name) => {
      if (name === null) {
        swal.close();
      } else if (name.trim() === '') {
        return askForRoomName(); // Reopen the prompt if the name is empty
      } else {
        return name.trim();
      }
    })
    .catch((err) => {
      swal.stopLoading();
      swal.close();
    });
}

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
      buttonText === 'Start Moderating' ?
        'Stop Moderating' :
        'Start Moderating';
  }
  btnStartModerating.innerText = newText;
}

/**
 * Toggles the visibility of a panel button with the class 'invisible'.
 * @return {void}
 */
function changePanelVisibility() {
  if (pnButtonsGameController.style.display === 'flex') {
    pnButtonsGameController.style.display = 'none';
  } else {
    pnButtonsGameController.style.display = 'flex';
  }
}

/**
 * Toggles the visibility of the button 'Edit Room's name' with the class 'invisible'.
 * @return {void}
 */
function changeEditRoomNameVisibility() {
  btnEditRoomName.classList.toggle('invisible');
}

export {
  changeTextInMenuItem,
  changePanelVisibility,
  changeEditRoomNameVisibility,
};

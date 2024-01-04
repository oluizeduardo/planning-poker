/* eslint-disable max-len */
import {
  BACKGROUND_MODE_DARK,
  CLASS_BG_DARK_THEME_LIGHT,
  CLASS_TEXT_WHITE,
  getBackgroundMode,
} from './darkMode.js';
import {changePanelVisibility, changeTextInMenuItem} from './gameControl.js';
import {
  emitCheckRoomAvailability,
  emitConnectWithRoom,
  emitDisconnectPlayer,
  emitUpdatePlayerName,
} from './socket-front-game.js';
import {
  clearStorage,
  getUserData,
  saveUserData,
} from './userSessionStorage.js';

const btnLogOut = document.getElementById('btnLogOut');
const btnInvitePlayers = document.getElementById('btnInvitePlayers');
const btnEditPlayerName = document.getElementById('btnEditName');
const roomNameLabel = document.getElementById('room-name');
const playersList = document.getElementById('players-list');
const playerNameManuItem = document.getElementById('player-name-menu-item');

window.addEventListener('load', () => {
  const roomId = getRoomId();
  if (roomId) {
    connectInTheRoom(roomId);
  } else {
    redirectToIndex();
  }
});

// LOG OUT
btnLogOut.addEventListener('click', (e) => {
  swal({
    title: 'Leave the room?',
    text: 'This room will be available as long as there are participants.',
    icon: 'warning',
    buttons: ['Cancel', 'Yes, leave it!'],
    dangerMode: true,
  }).then((confirmExit) => {
    if (confirmExit) {
      processDisconnectPlayer();
    }
  });
});

// INVITE PLAYERS
btnInvitePlayers.addEventListener('click', (e) => {
  const roomId = getRoomId();
  const message = `Share this code with your teammates and start playing!\n\n${roomId}`;
  swal('Invite players', message);
});

// UPDATE PLAYER'S NAME
btnEditPlayerName.addEventListener('click', () => {
  askForUserName()
    .then((userInput) => {
      const newName = userInput || 'Anonymous';
      const userData = getUserData();
      const {userId, roomId} = userData;
      const updatedData = {userId, roomId, newName};
      emitUpdatePlayerName(updatedData);
      saveUserData({...userData, userName: newName});
      printPlayerNameInProfileMenu(newName);
    })
    .catch((error) => {
      console.error('An error occurred while updating the player name:', error);
    });
});

/**
 * Disconnects the player from the current session.
 *
 * This function retrieves the user data, emits a disconnect event
 * to the server, clears local storage, and redirects the user to
 * the index page.
 *
 * This function should only be executed during the logout.
 *
 * @return {void} This function does not return a value.
 */
function processDisconnectPlayer() {
  const {roomId, userId} = getUserData();
  emitDisconnectPlayer(roomId, userId);
  clearStorage();
  redirectToIndex();
}

/**
 * Removes a player's HTML element from a list based on the provided user ID.
 *
 * This function looks for an HTML element with the specified user ID and removes it
 * from its parent node (assumed to be a list). If the element is not found, a message
 * is logged to the console.
 *
 * @param {string} userId - The unique identifier of the player to be removed.
 * @return {void} This function does not return a value directly.
 */
function removePlayerFromList(userId) {
  const elementToRemove = document.getElementById(userId);
  if (elementToRemove) {
    const list = elementToRemove.parentNode;
    list.removeChild(elementToRemove);
  } else {
    console.log(`Player with ID ${userId} not found to remove.`);
  }
}

/**
 * Connects to the specified room after checking its availability.
 * @param {string} roomId - The identifier of the room to connect to.
 */
function connectInTheRoom(roomId) {
  checkRoomAvailability(roomId)
    .then((room) => {
      if (room) {
        handleRoomAvailable(roomId);
      } else {
        handleRoomNotAvailable();
      }
    })
    .catch((error) => {
      console.error(
        'An error occurred while checking room availability:',
        error,
      );
    });
}

/**
 * Checks the availability of the specified room.
 *
 * @param {string} roomId - The identifier of the room to check.
 * @return {Object|null} - Information about the room if available, or null if not.
 */
async function checkRoomAvailability(roomId) {
  return new Promise((resolve) => {
    emitCheckRoomAvailability(roomId, resolve);
  });
}

/**
 * Handles the availability of a room by obtaining user data and connecting to the room.
 *
 * @async
 * @function
 * @param {string} roomId - The ID of the room.
 * @throws {Error} If there is an error during the process.
 * @return {Promise<void>} A promise that resolves once the room is handled.
 */
async function handleRoomAvailable(roomId) {
  try {
    const storedData = getUserData() || {};
    const userName = await getValidUserName(storedData.userName);

    const userData = {
      roomId: roomId || getRoomId(),
      isModerator: !!storedData.isModerator,
      connection: {
        userName: userName || 'Anonymous',
      },
    };

    emitConnectWithRoom(userData, processesBasicSettings);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Retrieves a valid user name, either from the stored user data or by prompting the user.
 * If the stored user name is non-empty, it is used.
 * Otherwise, the user is prompted to provide a user name.
 *
 * @async
 * @function
 * @param {string} storedUserName - The user name stored in the user data.
 * @return {Promise<?string>} A promise that resolves to a valid user name.
 *        If a valid user name is obtained, it is returned; otherwise, null.
 * @throws {Error} Throws an error if there is an issue with obtaining the user name.
 */
async function getValidUserName(storedUserName) {
  const userName = isNonEmptyString(storedUserName) ?
    storedUserName :
    await askForUserName();
  return isNonEmptyString(userName) ? userName : null;
}

/**
 * Checks whether a given input is a non-null, non-empty string.
 * @param {string} input - The input to be checked for non-null, non-empty string condition.
 * @return {boolean} - Returns `true` if the input is a non-null, non-empty string; otherwise, returns `false`.
 */
function isNonEmptyString(input) {
  return input && input.trim().length > 0;
}

/**
 * Handles the scenario when a room is not available.
 * Displays a sweet alert with information about the unavailability,
 * prompting the user to check the room's code. After the alert is dismissed,
 * it redirects the user to the index page.
 * @return {void}
 */
function handleRoomNotAvailable() {
  showRoomNotAvailableMessage('Please check the room\'s code.');
}

/**
 * Processes basic settings for user data.
 *
 * This function takes a data object containing user information,
 * including roomName, and performs operations such as saving the
 * user data and printing the room name.
 *
 * @param {Object} data - The data object containing user information.
 * @return {void} This function does not return a value.
 */
function processesBasicSettings(data) {
  saveUserData(data);
  printRoomName(data.roomName);
  printPlayerNameInProfileMenu(data.userName);
  adjustComponentsForModerator(data.isModerator);
}

/**
 * Adjusts components based on the moderator status.
 *
 * If the user is a moderator, this function changes the text in a menu item
 * to 'Stop Moderating' and adjusts the visibility of a panel.
 *
 * @param {boolean} isModerator - A boolean indicating whether the user is a moderator.
 * @return {void}
 */
function adjustComponentsForModerator(isModerator) {
  if (isModerator) {
    changeTextInMenuItem('Stop Moderating');
    changePanelVisibility();
  }
}

/**
 * Updates the player's name in the profile menu item.
 *
 * This function takes a user name as a parameter and sets the inner text of the
 * profile menu item to display the provided user name.
 *
 * @param {string} userName - The name of the player to be displayed in the profile menu.
 * @return {void} - This function does not return any value.
 */
function printPlayerNameInProfileMenu(userName) {
  playerNameManuItem.innerText = userName;
}

/**
 * Updates the text content of a DOM element with the provided room name.
 *
 * @param {string} roomName - The name of the room to be displayed.
 * @return {void} - This function does not return a value.
 */
function printRoomName(roomName) {
  roomNameLabel.innerText = roomName;
}

/**
 * Prompts the user to enter their name using a SweetAlert (swal) dialog.
 * @return {Promise<string | null>} A Promise that resolves with the
 * entered name or null if the user cancels the input.
 * @throws {Error} If SweetAlert is not available or if there is
 * an issue displaying the dialog.
 */
function askForUserName() {
  return swal({
    title: 'Please enter your name',
    text: 'Or leave it blank to enter as anonymous.',
    content: {
      element: 'input',
      attributes: {
        placeholder: 'Type your name',
      },
    },
    closeOnClickOutside: false,
    closeOnEsc: false,
    buttons: {
      confirm: true,
    },
  });
}

/**
 * Retrieves the room ID from the specified parameter
 * using the getValueFromParameter function.
 * @return {string} The room ID obtained from the 'id' parameter.
 * @throws {Error} Throws an error if the 'id'
 * parameter is not available or is not a string.
 */
function getRoomId() {
  return getValueFromParameter('id');
}

/**
 * Retrieves the value of a specified parameter from the
 * current URL's query string.
 *
 * @param {string} parameter - The name of the parameter whose
 * value is to be retrieved.
 * @return {string | null} The value of the specified parameter
 * if found, or null if the parameter is not present.
 */
function getValueFromParameter(parameter) {
  const urlObject = new URL(window.location.href);
  const parameters = urlObject.searchParams;
  return parameters.get(parameter);
}

/**
 * Redirects the user to the index page.
 * @return {void}
 */
function redirectToIndex() {
  window.location.href = '/';
}

/**
 * Clears the existing content of the playersList element and
 * adds player names to the list.
 *
 * @param {Array<Object>} users - An array of user objects containing
 * userId and userName.
 * @return {void}
 */
function addPlayerNameOnTheList(users) {
  playersList.innerHTML = '';

  const backgroundMode = getBackgroundMode();
  const darkThemeClasses = {
    backgroundColor:
      backgroundMode === BACKGROUND_MODE_DARK ? CLASS_BG_DARK_THEME_LIGHT : '',
    textColor: backgroundMode === BACKGROUND_MODE_DARK ? CLASS_TEXT_WHITE : '',
  };

  playersList.innerHTML = users
    .map(({userId, userName, isModerator}) => {
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`;
      const classVisibility = isModerator ? '' : 'invisible';

      return `
      <div id="${userId}" class="list-group-item d-flex justify-content-between align-items-center ${darkThemeClasses.backgroundColor}">
        <div class="d-flex align-items-center">
          <img class="avatar me-2" src="${avatarUrl}" alt="">
          <h6 class="list-item-player-name my-0 ${darkThemeClasses.textColor}">${userName}</h6>
          <span class="ms-2 icon-game-control ${classVisibility}" data-bs-toggle="tooltip" title="This player is a moderator">
            &#127918;
          </span>
        </div>
        <h5>
          <strong class="pe-3"></strong>
        </h5>
      </div>`;
    })
    .join('');
}

/**
 * Displays a message indicating that a new player is online.
 *
 * @param {string} [userName] - The username of the new player. If not provided, a default name is used.
 * @return {void}
 */
function showMessageNewPlayerOnline(userName) {
  const name = userName ? `<strong>${userName}</strong> is` : 'New Player';
  const message = `${name} online.`;
  showAlertMessage(message);
}

/**
 * Displays a message indicating that a player left the room.
 *
 * @param {string} [userName] - The username of the new player. If not provided, a default message is used.
 * @return {void}
 */
function showMessagePlayerDisconnected(userName) {
  const name = userName ? `<strong>${userName}</strong>` : 'A player';
  const message = `${name} left the room.`;
  showAlertMessage(message);
}

/**
 * Displays an alert message in a designated container on the webpage.
 *
 * @param {string} message - The message to be displayed in the alert.
 * @return {void} - The function does not return any value.
 */
function showAlertMessage(message) {
  const alertContainer = document.getElementById('alertContainer');
  const alertMessage = document.getElementById('alert_message');

  alertMessage.innerHTML = message;
  alertContainer.style.display = 'block';

  // Hide the alert container after 2700 milliseconds (2.7 seconds)
  setTimeout(() => {
    alertContainer.style.display = 'none';
  }, 2700);
}

/**
 * Displays a warning message indicating that the room is not available.
 * @param {string} text - The additional text to be displayed in the message.
 * @return {void}
 */
function showRoomNotAvailableMessage(text) {
  clearStorage();
  swal({
    title: 'Room not available!',
    text: text,
    icon: 'warning',
  }).then(() => {
    redirectToIndex();
  });
}

export {
  addPlayerNameOnTheList,
  redirectToIndex,
  showMessageNewPlayerOnline,
  removePlayerFromList,
  showMessagePlayerDisconnected,
  showRoomNotAvailableMessage,
  printPlayerNameInProfileMenu,
};

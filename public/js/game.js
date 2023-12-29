/* eslint-disable max-len */
import {
  emitCheckRoomAvailability,
  emitConnectWithRoom,
  emitDisconnectPlayer,
  emitGetPlayers,
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
    emitGetPlayers(roomId);
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
btnEditPlayerName.addEventListener('click', async (e) => {
  try {
    const newName = await askForUserName() || 'Anonymous';
    const userData = getUserData();
    const {userId, roomId} = userData;
    const updatedData = {userId, roomId, newName};
    saveUserData({...userData, userName: newName});
    emitUpdatePlayerName(updatedData);
  } catch (error) {
    console.error('An error occurred while updating the player name:', error);
  }
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
 * Connects to a specified room, checking its availability
 * and handling the connection process.
 *
 * @param {string} roomId - The identifier of the room to connect to.
 * @return {void}
 */
async function connectInTheRoom(roomId) {
  const room = await checkRoomAvailability(roomId);
  if (room) {
    handleRoomAvailable(roomId);
  } else {
    handleRoomNotAvailable();
  }
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
  const userName = isNonEmptyString(storedUserName) ? storedUserName : await askForUserName();
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
  swal({
    title: 'Room not available!',
    text: 'Please check the room\'s code.',
    icon: 'info',
  }).then(() => {
    redirectToIndex();
  });
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
    content: 'input',
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
 * Adds a player's name to the player list in the HTML.
 *
 * This function appends a new list item to the player list with the specified
 * user name and user ID, creating a visual representation of the player.
 *
 * @param {string} users - A list of users.
 * @param {string} userId - The unique identifier for the player.
 * @return {void} This function does not return a value.
 */
function addPlayerNameOnTheList(users) {
  let html = '';
  users.forEach((user) => {
    const {userId, userName} = user;
    html += `
      <li id="${userId}" class="list-group-item d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img class="avatar me-2" src="https://api.dicebear.com/7.x/bottts/svg?seed=${userName}" alt="Avatar">
          <h6 class="my-0">${userName}</h6>    
        </div>
        <h5>
          <strong class="pe-3"></strong>
        </h5>
      </li>`;
  });
  playersList.innerHTML = html;
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

export {
  addPlayerNameOnTheList,
  redirectToIndex,
  showMessageNewPlayerOnline,
  removePlayerFromList,
  showMessagePlayerDisconnected,
  printPlayerNameInProfileMenu,
};

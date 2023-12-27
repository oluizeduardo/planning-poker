/* eslint-disable max-len */
import {
  emitCheckRoomAvailability,
  emitConnectWithRoom,
  emitDisconnectPlayer,
  emitGetPlayers,
} from './socket-front-game.js';
import {
  clearStorage,
  getUserData,
  saveUserData,
} from './userSessionStorage.js';

const btnLogOut = document.getElementById('btnLogOut');
const btnInvitePlayers = document.getElementById('btnInvitePlayers');
const roomNameLabel = document.getElementById('room-name');
const playersList = document.getElementById('players-list');
const playerNameManuItem = document.getElementById('player-name-menu-item');

window.addEventListener('load', () => {
  const roomId = getRoomId();
  if (roomId) {
    connectInTheRoom();
    emitGetPlayers(roomId);
  } else {
    redirectToIndex();
  }
});

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

btnInvitePlayers.addEventListener('click', (e) => {
  const roomId = getRoomId();
  const message = `Share this code with your teammates and start playing!\n\n${roomId}`;
  swal('Invite players', message);
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
  const userData = JSON.parse(getUserData());
  emitDisconnectPlayer(userData.roomId, userData.userId);
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
 * Establishes a connection with a room and updates the room name label.
 *
 * This function uses the `emitConnectWithRoom` function to connect to a room
 * identified by the current room ID. Once connected, the room name is retrieved
 * and updated in the specified label element.
 *
 * @throws {Error} Throws an error if the connection with the room fails.
 * @return {void}
 */
function connectInTheRoom() {
  const roomId = getRoomId();

  emitCheckRoomAvailability(roomId, async (room) => {
    if (room) {
      if (!getUserData()) {
        try {
          const userName = await askForUserName();
          let finalUserName = userName;

          if (!isNonEmptyString(userName)) {
            finalUserName = 'Anonymous';
          }

          const newConnection = {
            roomId: getRoomId(),
            connection: {
              userName: finalUserName,
            },
          };

          saveUserData(finalUserName);
          emitConnectWithRoom(newConnection, processesBasicSettings);
        } catch (error) {
          console.error('Error:', error.message);
        }
      } else {
        printRoomName(room.roomName);
      }
    } else {
      handleRoomNotAvailable();
    }
  });
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
  saveUserData(JSON.stringify(data));
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
    title: 'Now write your name',
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
 * @param {string} userName - The name of the player to be added.
 * @param {string} userId - The unique identifier for the player.
 * @return {void} This function does not return a value.
 */
function addPlayerNameOnTheList(userName, userId) {
  playersList.innerHTML +=
  `<li id="${userId}" class="list-group-item d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center">
      <img class="avatar me-2" src="https://api.dicebear.com/7.x/bottts/svg?seed=${userName}" alt="Avatar">
      <h6 class="my-0">${userName}</h6>    
    </div>
    <h5>
      <strong class="pe-3"></strong>
    </h5>
  </li>`;
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

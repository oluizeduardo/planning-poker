/* eslint-disable max-len */
import {emitConnectWithRoom, emitGetPlayers} from './socket-front-game.js';
import {clearStorage, getUser, saveUser} from './userSessionStorage.js';

const btnLogOut = document.getElementById('btnLogOut');
const btnInvitePlayers = document.getElementById('btnInvitePlayers');
const roomNameLabel = document.getElementById('room-name');
const playersList = document.getElementById('players-list');

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
      clearStorage();
      redirectToIndex();
    }
  });
});

btnInvitePlayers.addEventListener('click', (e) => {
  const roomId = getRoomId();
  const message = `Share this code with your teammates and start playing!\n\n${roomId}`;
  swal('Invite players', message);
});

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
  if (!getUser()) {
    askForUserName()
      .then((userName) => {
        if (!userName) userName = 'Anonymous';
        const newConnection = {
          roomId: getRoomId(),
          connection: {
            userName: userName,
          },
        };
        emitConnectWithRoom(newConnection, printRoomName);
        saveUser(userName);
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  }
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
 * Adds a player name to the players list in the HTML.
 *
 * @param {string} userName - The name of the player to be added to the list.
 */
function addPlayerNameOnTheList(userName) {
  playersList.innerHTML +=
  `<li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <h6 class="my-0">${userName}</h6>
    </div>
    <h5>
      <strong class="pe-3">...</strong>
    </h5>
  </li>`;
}

export {addPlayerNameOnTheList};

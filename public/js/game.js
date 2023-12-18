/* eslint-disable max-len */
import {emitConnectWithRoom} from './socket-front-game.js';

const btnLogOut = document.getElementById('btnLogOut');
const btnInvitePlayers = document.getElementById('btnInvitePlayers');
const roomNameLabel = document.getElementById('room-name');

window.addEventListener('load', () => {
  connectInTheRoom();
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
      window.location.href = '/';
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
  askForUserName()
    .then((userName) => {
      const newConnection = {
        roomId: getRoomId(),
        connection: {
          userName: userName,
        },
      };
      emitConnectWithRoom(newConnection, (roomName) => {
        console.log(`Player [${userName}] online in the room [${roomName}].`);
        roomNameLabel.innerText = roomName;
      });
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
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
    text: 'How you want the team to identify you.',
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

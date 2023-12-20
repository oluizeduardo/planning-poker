import {addPlayerNameOnTheList} from './game.js';

/* eslint-disable max-len */
const socket = io();

socket.on('disconnect', () => {
  swal({
    title: 'Room not available',
    text: 'You are disconnected from this room.',
    icon: 'warning',
  }).then(() => {
    window.location.href = '/';
  });
});

socket.on('update_players_list', (userName) => {
  console.log(`ADD NEW PLAYER [${userName}]`);
  addPlayerNameOnTheList(userName);
});

/**
 * Emits a 'connect_room' event with the specified roomId
 * to the socket and handles the response.
 *
 * @param {string} newConnection
 * @param {function} callback - The callback function to be executed
 * after the connection attempt. It receives the name of the found room
 * if successful.
 * @return {void}
 */
function emitConnectWithRoom(newConnection, callback) {
  socket.emit('connect_room', newConnection, (foundRoom) => {
    if (foundRoom) {
      console.log(
        `Client connected with success in the room [${newConnection.roomId}]`,
      );
      callback(foundRoom.roomName);
    } else {
      swal({
        title: 'Room not available!',
        text: 'Please check the room\'s code.',
        icon: 'info',
      }).then(() => {
        window.location.href = '/';
      });
    }
  });
}

/**
 * Emits a 'get_players' event to the server with the provided roomId,
 * and handles the response by adding player names to a list.
 *
 * @param {string} roomId - The unique identifier of the room to fetch players from.
 * @throws {Error} If the roomId parameter is not a non-empty string.
 */
function emitGetPlayers(roomId) {
  socket.emit('get_players', roomId, (players) => {
    players.forEach((player) => {
      addPlayerNameOnTheList(player.userName);
    });
  });
}

export {emitConnectWithRoom, emitGetPlayers};

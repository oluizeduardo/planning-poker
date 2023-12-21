import {addPlayerNameOnTheList, redirectToIndex} from './game.js';
import {clearStorage} from './userSessionStorage.js';

/* eslint-disable max-len */
const socket = io();

socket.on('disconnect', () => {
  swal({
    title: 'Room not available',
    text: 'You are disconnected from this room.',
    icon: 'warning',
  }).then(() => {
    clearStorage();
    redirectToIndex();
  });
});

socket.on('update_players_list', (userName) => {
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

/**
 * Emits a request to check the availability of a room with the specified ID to the server.
 * The server responds with information about the room, which is then passed to the provided callback function.
 *
 * @param {string} roomId - The unique identifier of the room to be checked for availability.
 * @param {function} callback - A callback function to handle the response from the server.
 *   It receives the room information as its parameter.
 * @return {void}
 */
function emitCheckRoomAvailability(roomId, callback) {
  socket.emit('check_room_availability', roomId, (room) => {
    callback(room);
  });
}

export {emitConnectWithRoom, emitGetPlayers, emitCheckRoomAvailability};

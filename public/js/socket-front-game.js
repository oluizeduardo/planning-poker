/* eslint-disable max-len */
import {
  addPlayerNameOnTheList,
  redirectToIndex,
  removePlayerFromList,
  showMessageNewPlayerOnline,
  showMessagePlayerDisconnected,
} from './game.js';
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

socket.on('add_player_list', (data) => {
  addPlayerNameOnTheList(data.userName, data.userId);
  showMessageNewPlayerOnline(data.userName);
});

socket.on('remove_player_list', (user) => {
  removePlayerFromList(user.userId);
  showMessagePlayerDisconnected(user.userName);
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

      const newConnectionResponseData = {
        userName: newConnection.connection.userName,
        userId: socket.id,
        roomName: foundRoom.roomName,
        roomId: foundRoom.roomId,
      };

      callback(newConnectionResponseData);
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
      addPlayerNameOnTheList(player.userName, player.userId);
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

/**
 * Emits a 'disconnect_player' event to the server and executes a callback upon completion.
 *
 * This function sends a 'disconnect_player' event to the server with the provided
 * roomId and userId.
 *
 * @param {string} roomId - The identifier of the room where the disconnection occurred.
 * @param {string} userId - The identifier of the user who disconnected.
 * @return {void} This function does not return a value directly.
 */
function emitDisconnectPlayer(roomId, userId) {
  socket.emit('disconnect_player', roomId, userId);
}

export {
  emitConnectWithRoom,
  emitGetPlayers,
  emitCheckRoomAvailability,
  emitDisconnectPlayer,
};

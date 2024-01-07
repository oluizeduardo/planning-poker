/* eslint-disable max-len */
import {
  addPlayerNameOnTheList,
  printRoomName,
  removePlayerFromList,
  showMessageNewPlayerOnline,
  showMessagePlayerDisconnected,
  showPlayerDone,
  showRoomNotAvailableMessage,
} from './game.js';

const socket = io();

socket.on('disconnect', () => {
  showRoomNotAvailableMessage('You are disconnected from this room.');
});

// Emitted by the server to update the list of players in the frontend.
socket.on('update_players_list', (newUser, users, showAlertMessage = true) => {
  addPlayerNameOnTheList(users);
  if (showAlertMessage) {
    showMessageNewPlayerOnline(newUser.userName);
  }
});

// Emitted by the server to remove a specific user from the list.
socket.on('remove_player_list', (user) => {
  removePlayerFromList(user.userId);
  showMessagePlayerDisconnected(user.userName);
});

// Emitted by the server to update the room's name.
socket.on('update_room_name', (newRoomName) => {
  printRoomName(newRoomName);
});

// Emitted by the server to inform that a specific user has already voted.
socket.on('show_player_done', (userId) => {
  showPlayerDone(userId);
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

      const {roomName, roomId} = foundRoom;
      const {userName, isModerator, point} = newConnection.connection;

      // Object to save in session storage.
      const newConnectionResponseData = {
        userId: socket.id,
        roomName,
        roomId,
        point,
        userName,
        isModerator,
      };

      callback(newConnectionResponseData);
    } else {
      showRoomNotAvailableMessage('Please check the room\'s code.');
    }
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

/**
 * Emits an 'update_player_name' event to the server with the provided data.
 * @param {Object} data - The data to be sent with the 'update_player_name' event.
 * @return {void} - This function does not return any value.
 */
function emitUpdatePlayerName(data) {
  socket.emit('update_player_name', data);
}

/**
 * Emits a 'update_user_moderator' event through the socket to make a user a moderator.
 * @param {Object} user - The user object to be made a moderator.
 */
function emitUpdateUserModeratorStatus(user) {
  if (user) {
    socket.emit('update_user_moderator_status', user);
  }
}

/**
 * Emits a 'update_room_name' event through the socket to change the room's name.
 * @param {Object} updateRoomNameObject - The object containing the roomId and the new name.
 */
function emitUpdateRoomName(updateRoomNameObject) {
  if (updateRoomNameObject) {
    socket.emit('update_room_name', updateRoomNameObject);
  }
}

/**
 * Emits the chosen card data to inform the server which was the chosen
 * point and by which player.
 *
 * @param {Object} chosenCardData - The data of the chosen card.
 * @param {string} chosenCardData.userId - The user ID associated with the chosen card.
 * @param {string} chosenCardData.point - The point or text associated with the chosen card.
 */
function emitChosenCard(chosenCardData) {
  if (chosenCardData) {
    socket.emit('chosen_card', chosenCardData);
  }
}

export {
  emitConnectWithRoom,
  emitCheckRoomAvailability,
  emitDisconnectPlayer,
  emitUpdatePlayerName,
  emitUpdateUserModeratorStatus,
  emitUpdateRoomName,
  emitChosenCard,
};

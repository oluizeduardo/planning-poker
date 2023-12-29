/* eslint-disable max-len */
import {getUser, getUsers} from '../models/game.model.js';

const EVENT_NAME = 'update_player_name';

/**
 * Registers an event listener for updating player name.
 *
 * This function listens for a specific event on the socket and invokes the
 * handleUpdatePlayerName function when the event occurs, passing the event data
 * and the provided Socket.IO instance for broadcasting updates.
 *
 * @param {Socket} socket - The Socket.IO socket to listen for events on.
 * @param {Server} io - The Socket.IO server instance for broadcasting updates.
 * @return {void}
 */
function registerUpdatePlayerNameEvent(socket, io) {
  socket.on(EVENT_NAME, (data) => {
    handleUpdatePlayerName(data, io);
  });
}

/**
 * Handles the update of a player's name in a room.
 *
 * @param {Object} data - The data object containing information about the update.
 * @param {string} data.roomId - The ID of the room where the update is taking place.
 * @param {string} data.userId - The ID of the user whose name is being updated.
 * @param {string} data.newName - The new name for the player.
 * @param {object} io - The socket.io instance for handling real-time communication.
 */
function handleUpdatePlayerName(data, io) {
  const user = getUser(data.roomId, data.userId);
  if (user) {
    user.userName = data.newName;
    const users = getUsers(data.roomId);
    io.to(data.roomId).emit('add_player_list', user, users);
  }
}

export default registerUpdatePlayerNameEvent;

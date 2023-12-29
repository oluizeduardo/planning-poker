/* eslint-disable max-len */
import {
  deleteRoom,
  getUser,
  getUsers,
  isRoomEmpty,
  removeUser,
} from '../models/game.model.js';
import logger from '../config/logger.js';

const EVENT_NAME = 'disconnect_player';

/**
 * Registers an event listener for player disconnection on the provided socket.
 * @param {SocketIO.Socket} socket - The socket on which to register the event listener.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 * @return {void}
 */
function registerDisconnectPlayerEvent(socket, io) {
  socket.on(EVENT_NAME, (roomId, userId) => {
    handleDisconnectPlayer(socket, io, roomId, userId);
  });
}

/**
 * Handles the disconnection of a player from a room.
 *
 * @param {Socket} socket - The Socket.io socket representing the connection.
 * @param {SocketIO.Server} io - The Socket.io server instance.
 * @param {string} roomId - The unique identifier of the room from which the player is disconnecting.
 * @param {string} userId - The unique identifier of the user (player) being disconnected.
 * @return {void}
 */
function handleDisconnectPlayer(socket, io, roomId, userId) {
  socket.leave(roomId);
  const userToBeRemoved = getUser(roomId, userId);
  removeUser(roomId, userId);
  logger.info(
    `Client [${userId}] has been disconnected from the room [${roomId}].`,
  );
  if (isRoomEmpty(roomId)) {
    deleteRoom(roomId);
    logger.info(`Room [${roomId}] is empty and has been deleted.`);
  } else {
    logRoomSizeStatus(roomId);
    emitRemovePlayerFromList(io, roomId, userToBeRemoved);
  }
}

/**
 * Logs the status of a room, including its ID and the number of connections.
 *
 * @param {string} roomId - The unique identifier of the room.
 * @return {void} - This function does not return any value.
 * @throws {Error} If there is an issue fetching user data for the specified room.
 */
function logRoomSizeStatus(roomId) {
  const users = getUsers(roomId);
  logger.info(
    `Room id: [${roomId}] - Number of connections: [${users.length}]`,
  );
}

/**
 * Emits a 'remove_player_list' event to all clients in a specific room,
 * signaling the removal of a player from a list.
 *
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 * @param {string} roomId - The unique identifier of the room where the event should be broadcasted.
 * @param {object} user - The user object representing the player to be removed from the list.
 */
function emitRemovePlayerFromList(io, roomId, user) {
  io.to(roomId).emit('remove_player_list', user);
}

export default registerDisconnectPlayerEvent;

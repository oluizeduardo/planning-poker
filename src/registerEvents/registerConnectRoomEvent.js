/* eslint-disable max-len */
import {findById, getUsers, joinGame} from '../models/game.model.js';
import logger from '../config/logger.js';

const EVENT_NAME = 'connect_room';

/**
 * Registers an event listener for handling new connections in a room.
 *
 * @param {SocketIO.Socket} socket - The Socket.IO socket instance.
 * @param {SocketIO.Server} io - The Socket.IO server instance. *
 * @param {Object} newConnection - Information about the new connection.
 * @param {Function} callback - A callback function to be called after handling the connection.
 * @return {void}
 */
function registerConnectRoomEvent(socket, io) {
  socket.on(EVENT_NAME, (newConnection, callback) => {
    handleConnectRoom(socket, io, newConnection, callback);
  });
}

/**
 * Handles the connection of a new client to a room.
 *
 * @param {Object} socket - The socket representing the connection to the client.
 * @param {Object} io - The socket.io instance.
 * @param {Object} newConnection - Object containing details of the new connection.
 * @param {string} newConnection.roomId - The ID of the room to connect to.
 * @param {Object} newConnection.connection - Details of the client's connection.
 * @param {string} newConnection.connection.userName - The username of the client.
 * @param {Function} callback - Callback function to be invoked after handling the connection.
 * @return {void}
 */
function handleConnectRoom(socket, io, newConnection, callback) {
  const roomId = newConnection.roomId;
  const userName = newConnection.connection.userName;
  const userId = socket.id;

  const foundRoom = findById(roomId);

  if (foundRoom) {
    // Join the socket to the identified room
    socket.join(roomId);

    // Save user details in the room's register.
    const user = {userId, userName, point: null};
    joinGame(roomId, user);

    // Log information about the new client connection
    logger.info(
      `New client connected - Client id: [${userId}] - Room name: [${foundRoom.roomName}] - Room id: [${foundRoom.roomId}]`,
    );

    // Log information about the room size.
    logRoomSizeStatus(roomId);

    const users = getUsers(roomId);

    // Emit event to update the list of players.
    io.to(roomId).emit('add_player_list', user, users);

    // Invoke the callback with the found room
    callback(foundRoom);
  } else {
    // Log a warning if an attempt is made to join a non-existent room
    logger.warn(`Attempted to join non-existent room.`);
    callback(foundRoom);
  }
}

/**
 * Logs information about the size/status of a room.
 *
 * @param {string} roomId - The unique identifier of the room.
 * @return {void} - This function does not return any value.
 * @throws {Error} - If there is an issue retrieving user information for the specified room.
 */
function logRoomSizeStatus(roomId) {
  const users = getUsers(roomId);
  logger.info(
    `Room id: [${roomId}] - Number of connections: [${users.length}]`,
  );
}

export default registerConnectRoomEvent;

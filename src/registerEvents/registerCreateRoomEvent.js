/* eslint-disable max-len */
import logger from '../config/logger.js';
import {createGame} from '../models/game.model.js';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';

const EVENT_NAME = 'create_room';

/**
 * Registers an event listener for the 'create_room' event on the provided socket.
 * When the 'create_room' event is received, it invokes the handleCreateRoom function
 * with the socket, roomName, and callback parameters.
 *
 * @param {SocketIO.Socket} socket - The socket on which to register the event listener.
 * @return {void}
 */
function registerCreateRoomEvent(socket) {
  socket.on(EVENT_NAME, (roomName, callback) => {
    handleCreateRoom(socket, roomName, callback);
  });
}

/**
 * Handles the creation of a chat room, generates a unique identifier for the room,
 * adds the room to the system, and invokes the provided callback with the generated roomId.
 *
 * @param {Socket} socket - The socket object representing the connection.
 * @param {string} roomName - The name of the room to be created.
 * @param {function} callback - The callback function to be invoked after room creation,
 *                              taking the generated roomId as its argument.
 * @return {void} - Disconnects the socket if the callback is not a valid function.
 */
function handleCreateRoom(socket, roomName, callback) {
  if (typeof callback !== 'function') {
    return socket.disconnect();
  }
  const roomId = createIdFromString(roomName);
  createGame(roomId, roomName);

  logger.info(`New room created - Room id: [${roomId}] Room name [${roomName}]`);

  callback(roomId);
}

/**
 * Generates a unique identifier based on the provided text using UUIDv4 and UUIDv5.
 *
 * @param {string} text - The input text used to create the identifier.
 * @return {string} The generated identifier, truncated to the first part.
 */
function createIdFromString(text) {
  const randomUuid = uuidv4();
  const fullId = uuidv5(text, randomUuid);
  return fullId.split('-')[0];
}

export default registerCreateRoomEvent;

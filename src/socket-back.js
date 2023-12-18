/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
import logger from './config/logger.js';
import {createGame, findById, getUsers, joinGame} from './models/game.model.js';
import io from './server.js';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';

io.on('connection', handleConnection);

/**
 * Handles incoming socket connections and sets up event listenersfor specific events.
 *
 * @param {Socket} socket - The socket object representing the connection.
 * @listens 'create_room' - Listens for the 'create_room' event to create a new room.
 * @param {string} roomName - The name of the room to be created.
 * @param {function} callback - The callback function to be executed after creating the room.
 * @listens 'connect_room' - Listens for the 'connect_room' event to connect to an existing room.
 * @param {string} roomId - The ID of the room to connect to.
 * @param {function} callback - The callback function to be executed after connecting to the room.
 * @listens 'disconnect' - Listens for the 'disconnect' event to handle disconnection.
 * @param {string} reason - The reason for the disconnection.
 */
function handleConnection(socket) {
  socket.on('create_room', (roomName, callback) => {
    handleCreateRoom(socket, roomName, callback);
  });
  socket.on('connect_room', (newConnection, callback) => {
    handleConnectRoom(socket, newConnection, callback);
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
 * @returns {void} - Disconnects the socket if the callback is not a valid function.
 */
function handleCreateRoom(socket, roomName, callback) {
  if (typeof callback !== 'function') {
    return socket.disconnect();
  }
  const roomId = createIdFromString(roomName);
  createGame(roomId, roomName);
  callback(roomId);
}

/**
 * Handles the connection of a client to a room identified by the given roomId.
 *
 * @param {object} socket - The socket object representing the client connection.
 * @param {string} newConnection - Object containing details of the new connection.
 * @param {function} callback - A callback function to be called after the connection attempt.
 *                              It receives the found room as an argument.
 * @returns {void}
 */
function handleConnectRoom(socket, newConnection, callback) {
  const roomId = newConnection.roomId;
  const userName = newConnection.connection.userName;
  const userId = socket.id;

  const foundRoom = findById(roomId);

  if (foundRoom) {
    // Join the socket to the identified room
    socket.join(roomId);

    const user = {userId, userName, point: null};
    joinGame(roomId, user);

    const users = getUsers(roomId);

    // Log information about the new client connection
    logger.info(
      `New client connected - Client id: [${socket.id}] - Room name: [${foundRoom.roomName}] - Room id: [${foundRoom.roomId}]`,
    );
    logger.info(`Room id: [${roomId}] - Number of connections: [${users.length}]`);

    // Invoke the callback with the found room
    callback(foundRoom);
  } else {
    // Log a warning if an attempt is made to join a non-existent room
    logger.warn(`Attempted to join non-existent room.`);
    callback(foundRoom);
  }
}

/**
 * Generates a unique identifier based on the provided text using UUIDv4 and UUIDv5.
 *
 * @param {string} text - The input text for creating the identifier.
 * @returns {string} The generated unique identifier.
 *
 * @throws {Error} Throws an error if the UUIDv4 or UUIDv5 generation fails.
 */
function createIdFromString(text) {
  const randomUuid = uuidv4();
  return uuidv5(text, randomUuid);
}

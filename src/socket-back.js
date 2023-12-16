/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
import logger from './config/logger.js';
import io from './server.js';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';

/**
 * List of the available rooms.
 */
const rooms = [];

io.of('/').adapter.on('create-room', (room) => {
  logger.info(`Room [${room}] was created.`);
});

io.of('/').adapter.on('join-room', (room, id) => {
  logger.info(`Socket [${id}] has joined room [${room}].`);
});

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
  socket.on('connect_room', (roomId, callback) => {
    handleConnectRoom(socket, roomId, callback);
  });
  socket.on('disconnect', (reason) => {
    handleDisconnect(socket, reason);
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
  addRoom({
    id: roomId,
    name: roomName,
  });
  callback(roomId);
}

/**
 * Handles the connection of a client to a room identified by the given roomId.
 *
 * @param {object} socket - The socket object representing the client connection.
 * @param {string} roomId - The unique identifier of the room to connect to.
 * @param {function} callback - A callback function to be called after the connection attempt.
 *                              It receives the found room as an argument.
 * @returns {void}
 */
function handleConnectRoom(socket, roomId, callback) {
  const foundRoom = findRoomById(roomId);

  if (foundRoom) {
    // Join the socket to the identified room
    socket.join(roomId);

    // Log information about the new client connection
    logger.info(
      `New client connected - Client id: [${socket.id}] - Room name: [${foundRoom.name}] - Room id: [${foundRoom.id}]`,
    );

    // Invoke the callback with the found room
    callback(foundRoom);
  } else {
    // Log a warning if an attempt is made to join a non-existent room
    logger.warn(`Attempted to join non-existent room.`);
    callback(foundRoom);
  }
}

/**
 * Handles the disconnection of a client socket and logs the event.
 *
 * @param {Socket} socket - The socket object representing the disconnected client.
 * @param {string} reason - The reason for the disconnection.
 * @returns {void}
 */
function handleDisconnect(socket, reason) {
  logger.info(`Client [${socket.id}] disconnected! - Reason: ${reason}`);
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

/**
 * Adds a room to the list of rooms.
 *
 * @param {any} room - The room to be added.
 * @returns {void} - This function does not return anything. *
 * @throws {TypeError} - If the 'room' parameter is not provided.
 */
function addRoom(room) {
  rooms.push(room);
}

/**
 * Finds a room in the collection based on the provided room ID.
 *
 * @param {string|number} roomId - The unique identifier of the room to be found.
 * @returns {Object|undefined} - The room object if found, or undefined if not found.
 */
function findRoomById(roomId) {
  return rooms.find((room) => room.id === roomId);
}

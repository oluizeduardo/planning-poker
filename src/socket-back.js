/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
import {
  createGame,
  deleteRoom,
  findById,
  getUser,
  getUsers,
  isRoomEmpty,
  joinGame,
  removeUser,
  removeUserById,
} from './models/game.model.js';
import logger from './config/logger.js';
import io from './server.js';
import {v4 as uuidv4, v5 as uuidv5} from 'uuid';

io.on('connection', handleConnection);

/**
 * Handles incoming socket connections and sets up event listenersfor specific events.
 *
 * @param {Socket} socket - The socket object representing the connection.
 */
function handleConnection(socket) {
  socket.on('create_room', (roomName, callback) => {
    handleCreateRoom(socket, roomName, callback);
  });
  socket.on('connect_room', (newConnection, callback) => {
    handleConnectRoom(socket, newConnection, callback);
  });
  socket.on('get_players', (roomId, getListOfPlayers) => {
    getListOfPlayers(getUsers(roomId));
  });
  socket.on('disconnect_player', (roomId, userId) => {
    handleDisconnectPlayer(socket, roomId, userId);
  });
  socket.on('check_room_availability', (roomId, callback) => {
    handleCheckRoomAvailability(roomId, callback);
  });
  socket.on('update_player_name', (data) => {
    handleUpdatePlayerName(data);
  });
  socket.on('disconnect', () => {
    removeUserById(socket.id);
  });
}

/**
 * Handles the disconnection of a player from a room.
 *
 * This function removes the specified user from the room using the provided
 * roomId and userId.
 *
 * @param {string} roomId - The identifier of the room from which the player is disconnecting.
 * @param {string} userId - The identifier of the user who is disconnecting.
 * @return {void} This function does not return a value directly.
 */
function handleDisconnectPlayer(socket, roomId, userId) {
  socket.leave(roomId);
  const userToBeRemoved = getUser(roomId, userId);
  removeUser(roomId, userId);
  logger.info(`Client [${userId}] has been disconnected from the room [${roomId}].`);
  if (isRoomEmpty(roomId)) {
    deleteRoom(roomId);
    logger.info(`Room [${roomId}] is empty and has been deleted.`);
  } else {
    logRoomSizeStatus(roomId);
    emitRemovePlayerFromList(io, roomId, userToBeRemoved);
  }
}

/**
 * Checks the availability of a room with the specified roomId.
 *
 * @param {string} roomId - The identifier of the room to check availability for.
 * @returns {boolean} Returns a boolean indicating whether the room exists or not.
 *                   If the callback is not a function, it disconnects the socket.
 */
function handleCheckRoomAvailability(roomId, callback) {
  callback(findById(roomId));
}

/**
 * Handles the update of a player's name within a specific room.
 *
 * This function retrieves the user from the specified room using the provided
 * user ID and room ID, updates the user's username with the new name if the user
 * is found.
 *
 * @param {Object} data - The data object containing information about the update.
 * @param {string} data.userId - The unique identifier of the user whose name is to be updated.
 * @param {string} data.roomId - The unique identifier of the room where the user is located.
 * @param {string} data.newName - The new name to set for the user.
 * @return {void} - This function does not return any value.
 */
function handleUpdatePlayerName(data) {
  const user = getUser(data.roomId, data.userId);
  if (user) {
    user.userName = data.newName;
    const users = getUsers(data.roomId);
    io.to(data.roomId).emit('add_player_list', user, users);
  }
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
 * @returns {void} - This function does not return any value.
 * @throws {Error} - If there is an issue retrieving user information for the specified room.
 */
function logRoomSizeStatus(roomId) {
  const users = getUsers(roomId);
  logger.info(`Room id: [${roomId}] - Number of connections: [${users.length}]`);
}

/**
 * Generates a unique identifier based on the provided text using UUIDv4 and UUIDv5.
 *
 * @param {string} text - The input text used to create the identifier.
 * @returns {string} The generated identifier, truncated to the first part.
 */
function createIdFromString(text) {
  const randomUuid = uuidv4();
  const fullId = uuidv5(text, randomUuid);
  return fullId.split('-')[0];
}

/**
 * Emits a 'remove_player_list' event to the specified room using Socket.IO,
 * indicating the removal of a player from the list.
 *
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 * @param {string} roomId - The unique identifier of the room to which the event is emitted.
 * @param {object} user - The user object representing the player to be removed from the list.
 *                       This object should contain the necessary information about the player.
 * @returns {void}
 */
function emitRemovePlayerFromList(io, roomId, user) {
  io.to(roomId).emit('remove_player_list', user);
}

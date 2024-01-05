/* eslint-disable max-len */
import {getUser, getUsers} from '../models/game.model.js';

const EVENT_NAME = 'update_user_moderator_status';

/**
 * Registers a socket event listener to handle updates in user moderator status.
 *
 * @param {Socket} socket - The socket instance to register the event listener.
 * @param {Server} io - The Socket.IO server instance.
 * @throws {Error} Will throw an error if the 'socket' or 'io' parameters are not provided.
 */
function registerUpdateUserModeratorStatus(socket, io) {
  if (socket && io) {
    socket.on(EVENT_NAME, (data) => {
      handleUpdateUserModeratorStatus(data, io);
    });
  } else {
    throw new Error('Invalid parameters.');
  }
}

/**
 * Handles the update of a user's moderator status in a room and broadcasts the updated player list.
 *
 * @param {Object} data - The data object containing information about the update.
 * @property {string} data.roomId - The unique identifier of the room.
 * @property {string} data.userId - The unique identifier of the user.
 * @property {boolean} data.isModerator - The updated moderator status for the user.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 * @throws {Error} Will throw an error if the 'data' parameter is not provided or is not an object.
 */
function handleUpdateUserModeratorStatus(data, io) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data parameter. Expected an object.');
  }

  const {roomId, userId, isModerator} = data;

  // Retrieve the registered user.
  const registeredUser = getUser(roomId, userId);

  // Update the user's moderator status if the user is registered.
  if (registeredUser) {
    registeredUser.isModerator = isModerator;

    // Get the updated list of users in the room.
    const updatedUsersList = getUsers(roomId);

    // Do not show the alert message for clients after updating moderator status.
    const showAlertMessage = false;

    // Broadcast the updated players list to all clients in the room.
    io.to(roomId).emit('update_players_list', registeredUser, updatedUsersList, showAlertMessage);
  }
}

export default registerUpdateUserModeratorStatus;

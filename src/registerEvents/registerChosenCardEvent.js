/* eslint-disable max-len */
import logger from '../config/logger.js';
import {updatePoint} from '../models/game.model.js';

const EVENT_NAME = 'chosen_card';

/**
 * Registers an event handler for the 'chosen_card' event on the provided WebSocket.
 *
 * This function listens for the 'chosen_card' event on the given WebSocket and calls
 * the {@link handleChosenCard} function when the event is triggered.
 *
 * @param {SocketIO.Socket} socket - The WebSocket on which to register the event handler.
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 */
function registerChosenCardEvent(socket, io) {
  if (socket && io) {
    socket.on(EVENT_NAME, (chosenCardData) => {
      handleChosenCard(io, chosenCardData);
    });
  } else {
    throw new Error('Invalid parameters.');
  }
}

/**
 * Handles the 'chosen_card' event by updating the point for a user in a specific room.
 *
 * @param {SocketIO.Server} io - The Socket.IO server instance.
 * @param {Object} chosenCardData - The data of the chosen card.
 * @param {string} chosenCardData.userId - The user ID associated with the chosen card.
 * @param {string} chosenCardData.roomId - The ID of the room in which the chosen card was selected.
 * @param {string} chosenCardData.point - The point or text associated with the chosen card.
 *
 * @throws {Error} Will throw an error if the provided userId, roomId, or point in chosenCardData is falsy.
 * @throws {Error} Will throw an error if the user with the specified userId and roomId is not found.
 */
function handleChosenCard(io, chosenCardData) {
  const {roomId, userId, point} = chosenCardData;
  updatePoint(roomId, userId, point);

  logger.info(`Player [${userId}] selected card [${point}].`);

  // Broadcast to all clients in the room that the player has already voted.
  io.to(roomId).emit('show_player_done', userId);
}

export default registerChosenCardEvent;

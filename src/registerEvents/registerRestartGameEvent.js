/* eslint-disable max-len */
import {resetGame} from '../models/game.model.js';
import logger from '../config/logger.js';

const EVENT_NAME = 'restart_game';

/**
 * Registers an event listener for restarting the game on the provided socket.
 *
 * @param {SocketIO.Socket} socket - The socket on which the event listener will be registered. *
 * @param {object} io - The socket.io instance for handling real-time communication.
 * @return {void}
 */
function registerRestartGameEvent(socket, io) {
  socket.on(EVENT_NAME, (roomId) => {
    handleRestartGame(socket, roomId, io);
  });
}

/**
 * Handles the restart of a game in a specified room.
 *
 * This function resets the game in the specified room, logs the restart information using the provided logger,
 * and emits a 'restart_game_front' event to all clients in the room through the provided Socket.IO instance.
 *
 * @param {SocketIO.Socket} socket - The Socket.IO socket instance representing the player initiating the restart.
 * @param {string} roomId - The unique identifier of the room where the game should be restarted.
 * @param {SocketIO.Server} io - The Socket.IO server instance used to emit events to clients.
 *
 * @return {void}
 */
function handleRestartGame(socket, roomId, io) {
  resetGame(roomId);

  logger.info(`Game restarted in the room [${roomId}] by the player [${socket.id}].`);

  io.to(roomId).emit('restart_game_front');
}

export default registerRestartGameEvent;

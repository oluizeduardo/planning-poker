/* eslint-disable max-len */
import {getUsers} from '../models/game.model.js';

const EVENT_NAME = 'get_final_average';

/**
 * Registers a socket.io event listener for the 'get_final_average' event.
 *
 * @param {Socket} socket - The socket connection to listen on.
 * @param {Server} io - The socket.io server.
 * @return {void}
 */
function registerGetFinalAverageEvent(socket, io) {
  socket.on(EVENT_NAME, (roomId) => {
    handleGetFinalAverage(io, roomId);
  });
}

/**
 * Handles the request to get the final average points for a room and emits the result to the room.
 *
 * @param {Server} io - The socket.io server.
 * @param {string} roomId - The identifier of the room.
 * @return {void}
 */
function handleGetFinalAverage(io, roomId) {
  const averagePoints = calculateAveragePoints(roomId);
  io.to(roomId).emit('reveal_final_average', averagePoints);
}

/**
 * Calculates the arithmetic mean of user points in a room.
 *
 * @param {string} roomId - The identifier of the room.
 *
 * @return {number} - The arithmetic mean of user points in the room.
 *                    Returns NaN if the room is not found or has no users.
 */
function calculateAveragePoints(roomId) {
  const users = getUsers(roomId);
  const votedPlayers = users.filter((user) => user.point !== null && user.point !== undefined);

  if (votedPlayers.length === 0) {
    return 0; // Returns 0 if no player voted to avoid division by zero.
  }

  const totalPoints = votedPlayers.reduce(
    (sum, user) => sum + parseInt(user.point, 10),
    0,
  );

  return Math.ceil(totalPoints / votedPlayers.length);
}

export default registerGetFinalAverageEvent;

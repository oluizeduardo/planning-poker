/* eslint-disable max-len */
import {extractPoints, getUsers} from '../models/game.model.js';

const EVENT_NAME = 'review_estimates';

/**
 * Registers a socket.io event listener for the 'review_estimates' event.
 *
 * @param {Socket} socket - The socket connection to listen on.
 * @param {Server} io - The socket.io server.
 * @return {void}
 */
function registerReviewEstimatesEvent(socket, io) {
  socket.on(EVENT_NAME, (roomId) => {
    handleReviewEstimates(io, roomId);
  });
}

/**
 * Handles the request to review the estimates of a room.
 *
 * @param {Server} io - The socket.io server.
 * @param {string} roomId - The identifier of the room.
 * @return {void}
 */
function handleReviewEstimates(io, roomId) {
  const finalResultObject = {
    roomId,
    average: calculateAveragePoints(roomId),
    points: extractPoints(roomId),
  };

  io.to(roomId).emit('reveal_final_result', finalResultObject);
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
  const votedPlayers = users.filter(
    (user) =>
      user.point !== null &&
      user.point !== undefined &&
      user.point !== '?' &&
      user.point !== 'COFFEE',
  );

  if (votedPlayers.length === 0) {
    return 0; // Returns 0 if no player voted to avoid division by zero.
  }

  const totalPoints = votedPlayers.reduce(
    (sum, user) => sum + parseInt(user.point, 10),
    0,
  );

  return Math.ceil(totalPoints / votedPlayers.length);
}

export default registerReviewEstimatesEvent;

/* eslint-disable max-len */
import {findById} from '../models/game.model.js';

const EVENT_NAME = 'check_room_availability';

/**
 * Registers an event listener for retrieving the list of players in a specific room.
 * @param {SocketIO.Socket} socket - The Socket.IO socket on which to register the event listener.
 * @return {void}
 */
function registerCheckRoomAvailabilityEvent(socket) {
  socket.on(EVENT_NAME, (roomId, callback) => {
    handleCheckRoomAvailability(roomId, callback);
  });
}

/**
 * Handles the check for room availability based on the given room ID.
 *
 * @param {string} roomId - The ID of the room to check availability for.
 * @param {function} callback - The callback function to be executed with the result.
 * @return {void}
 */
function handleCheckRoomAvailability(roomId, callback) {
  callback(findById(roomId));
}

export default registerCheckRoomAvailabilityEvent;

/* eslint-disable max-len */
import {findById} from '../models/game.model.js';

const EVENT_NAME = 'update_room_name';

/**
 * Registers an event listener for updating room name on the provided socket using Socket.IO.
 *
 * @param {Socket} socket - The Socket.IO socket on which the event listener will be registered.
 * @param {Server} io - The Socket.IO server instance to emit events to connected sockets.
 *
 * @throws {Error} Throws an error if either the socket or io parameter is falsy.
 */
function registerUpdateRoomNameEvent(socket, io) {
  if (socket && io) {
    socket.on(EVENT_NAME, (data) => {
      handleUpdateRoomName(data, io);
    });
  } else {
    throw new Error('Invalid parameters.');
  }
}

/**
 * Handles updating the name of a room based on the provided data and emits the updated name to connected clients.
 *
 * @param {Object} data - The data payload containing information for updating the room name.
 * @param {Server} io - The Socket.IO server instance to emit events to connected sockets.
 *
 * @throws {Error} Throws an error if the data parameter is falsy or not an object.
 */
function handleUpdateRoomName(data, io) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data parameter. Expected an object.');
  }

  const {roomId, newRoomName} = data;

  // Retrieve the registered room.
  const registeredRoom = findById(roomId);

  // Update the room's name if the room is registered.
  if (registeredRoom) {
    registeredRoom.roomName = newRoomName;

    // Broadcast the new room's name to all clients in the room.
    io.to(roomId).emit('update_room_name', newRoomName);
  }
}

export default registerUpdateRoomNameEvent;

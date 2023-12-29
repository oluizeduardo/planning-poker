/* eslint-disable max-len */
import {removeUserById} from '../models/game.model.js';

const EVENT_NAME = 'disconnect';

/**
 * Registers a 'disconnect' event listener on the provided socket,
 * which triggers the removal of the user associated with the socket ID.
 *
 * @param {SocketIO.Socket} socket - The Socket.IO socket on which to register the event listener.
 */
function registerDisconnectEvent(socket) {
  socket.on(EVENT_NAME, () => {
    removeUserById(socket.id);
  });
}

export default registerDisconnectEvent;

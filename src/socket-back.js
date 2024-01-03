/* eslint-disable max-len */
import io from './server.js';
import registerCreateRoomEvent from './registerEvents/registerCreateRoomEvent.js';
import registerConnectRoomEvent from './registerEvents/registerConnectRoomEvent.js';
import registerDisconnectEvent from './registerEvents/registerDisconnectEvent.js';
import registerDisconnectPlayerEvent from './registerEvents/registerDisconnectPlayerEvent.js';
import registerCheckRoomAvailabilityEvent from './registerEvents/registerCheckRoomAvailabilityEvent.js';
import registerUpdatePlayerNameEvent from './registerEvents/registerUpdatePlayerNameEvent.js';

io.on('connection', handleConnection);

/**
 * Handles incoming socket connections and sets up event listenersfor specific events.
 *
 * @param {Socket} socket - The socket object representing the connection.
 */
function handleConnection(socket) {
  registerCreateRoomEvent(socket);
  registerCheckRoomAvailabilityEvent(socket);
  registerConnectRoomEvent(socket, io);
  registerDisconnectPlayerEvent(socket, io);
  registerUpdatePlayerNameEvent(socket, io);
  registerDisconnectEvent(socket);
}

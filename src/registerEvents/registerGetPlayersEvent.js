/* eslint-disable max-len */
import {getUsers} from '../models/game.model.js';

const EVENT_NAME = 'get_players';

/**
 * Registers an event listener for retrieving the list of players in a specific room.
 * @param {SocketIO.Socket} socket - The Socket.IO socket on which to register the event listener.
 * @return {void}
 */
function registerGetPlayersEvent(socket) {
  socket.on(EVENT_NAME, (roomId, getListOfPlayers) => {
    getListOfPlayers(getUsers(roomId));
  });
}

export default registerGetPlayersEvent;

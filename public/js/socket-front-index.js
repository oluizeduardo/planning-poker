const socket = io();

/**
 * Emits a 'create_room' event with the specified
 * roomName to the server using the socket.
 *
 * If the server responds with a roomId, redirects to the game
 * with the provided roomId and roomName.
 *
 * @param {string} roomName - The name of the room to be created.
 * @return {void}
 */
function emitCreateRoom(roomName) {
  socket.emit('create_room', roomName, (roomId) => {
    if (roomId) {
      redirectToTheGame(roomId, roomName);
    }
  });
}

/**
 * Emits a connection request to the server
 * for a specific room and handles the response.
 *
 * @param {string} roomId - The unique identifier of the room to connect to.
 * @param {string} roomName - The name of the room.
 *
 * @throws {Error} If the socket is not defined.
 *
 * @return {void}
 *
 * @callback connectCallback
 * @param {boolean} isConnected - Indicates whether the connection
 * to the room was successful.
 *
 * @example
 * // Example usage:
 * emitConnectWithRoom('room123', 'My Room');
 */
function emitConnectWithRoom(roomId, roomName) {
  socket.emit('connect_room', roomId, (isConnected) => {
    if (isConnected) {
      console.log(`Client connected with success in the room [${roomId}]`);
      redirectToTheGame(roomId, roomName);
    } else {
      swal({
        title: 'Room not available!',
        text: 'Please check the room\'s code.',
        icon: 'info',
      }).then(() => {
        window.location.href = '/';
      });
    }
  });
}

/**
 * Redirects the user to the game page with specified room parameters.
 *
 * @param {string} roomId - The ID of the room.
 * @param {string} roomName - The name of the room.
 * @return {void}
 */
function redirectToTheGame(roomId, roomName) {
  const params = new URLSearchParams();
  params.append('id', roomId);
  window.location.href = '/game.html?' + params.toString();
}

export {emitCreateRoom, emitConnectWithRoom};

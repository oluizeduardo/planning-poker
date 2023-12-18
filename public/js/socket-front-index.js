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
 * Redirects the user to the game page with specified room parameters.
 *
 * @param {string} roomId - The ID of the room.
 * @return {void}
 */
function redirectToTheGame(roomId) {
  const params = new URLSearchParams();
  params.append('id', roomId);
  window.location.href = '/game.html?' + params.toString();
}

export {emitCreateRoom, redirectToTheGame};

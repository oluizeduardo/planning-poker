/* eslint-disable max-len */
const socket = io();

/**
 * Emits a 'create_room' event to the server with the specified room name and handles
 * the server's response by redirecting the user to the game page if a room ID is
 * received.
 * @param {string} roomName - The name of the room to be created.
 * @return {void}
 */
function emitCreateRoom(roomName) {
  socket.emit('create_room', roomName, (roomId) => {
    if (roomId) {
      saveRoomIdSessionStorage(roomId);
      redirectToTheGame(roomId);
    }
  });
}

/**
 * Save roomId in the session storage.
 * @param {string} roomId The ID that identifies the room.
 */
function saveRoomIdSessionStorage(roomId) {
  sessionStorage.setItem('room_id', roomId);
}

/**
 * Redirects the user to the game page or index page based on the provided room ID.
 *
 * If a valid room ID is provided, the user is redirected to the game page with the
 * specified room ID as a query parameter. If no room ID is provided, the user is
 * redirected to the index page.
 *
 * @param {string} roomId - The room ID to be included as a query parameter in the
 *                         redirection to the game page. If falsy, the user is
 *                         redirected to the index page.
 * @return {void}
 */
function redirectToTheGame(roomId) {
  if (roomId) {
    const params = new URLSearchParams();
    params.append('id', roomId);
    window.location.href = '/game.html?' + params.toString();
  } else {
    window.location.href = '/index.html';
  }
}

export {emitCreateRoom, redirectToTheGame};

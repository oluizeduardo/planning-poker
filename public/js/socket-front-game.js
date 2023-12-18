/* eslint-disable max-len */
const socket = io();

socket.on('disconnect', () => {
  swal({
    title: 'Room not available',
    text: 'You\'re disconnected from this room.',
    icon: 'warning',
  }).then(() => {
    window.location.href = '/';
  });
});

/**
 * Emits a 'connect_room' event with the specified roomId
 * to the socket and handles the response.
 *
 * @param {string} newConnection
 * @param {function} callback - The callback function to be executed
 * after the connection attempt. It receives the name of the found room
 * if successful.
 * @return {void}
 */
function emitConnectWithRoom(newConnection, callback) {
  socket.emit('connect_room', newConnection, (foundRoom) => {
    if (foundRoom) {
      console.log(`Client connected with success in the room [${newConnection.roomId}]`);
      callback(foundRoom.roomName);
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

export {emitConnectWithRoom};

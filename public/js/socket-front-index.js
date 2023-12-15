const socket = io();

function emitCreateRoom(roomName) {
  socket.emit("create_room", roomName, (roomId) => {
    if (roomId) {
      redirectToTheGame(roomId, roomName);
    }
  });
}

function emitConnectWithRoom(roomId, roomName) {
  socket.emit("connect_room", roomId, (isConnected) => {
    if (isConnected) {
      console.log(`Client connected with success in the room [${roomId}]`);
      redirectToTheGame(roomId, roomName);
    } else {
      swal({
        title: "Room not available!",
        text: "Please check the room's code.",
        icon: "info",
      }).then(() => {
        window.location.href = "/";
      });
    }
  });
}

/**
 * Redirects the user to the game page with specified room parameters.
 *
 * @param {string} roomId - The ID of the room.
 * @param {string} roomName - The name of the room.
 * @returns {void}
 */
function redirectToTheGame(roomId, roomName) {
  const params = new URLSearchParams();
  params.append("id", roomId);
  window.location.href = "/game.html?" + params.toString();
}

export { emitCreateRoom, emitConnectWithRoom };

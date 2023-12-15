const socket = io();

socket.on("disconnect", () => {
  swal({
    title: "Room not available",
    text: "You're disconnected from this room.",
    icon: "warning",
  }).then(() => {
    window.location.href = "/";
  });
});

function emitConnectWithRoom(roomId, callback) {
  socket.emit("connect_room", roomId, (foundRoom) => {
    if (foundRoom) {
      console.log(`Client connected with sucess in the room [${roomId}]`);
      callback(foundRoom.name);
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

export { emitConnectWithRoom };

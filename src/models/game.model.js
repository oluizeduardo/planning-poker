const rooms = [
  {
    roomId: "0000000000000000000",
    roomName: "Test Room",
    connections: [
      {
        userId: "1111111111",
        userName: "User Test",
        point: null,
      },
    ],
  },
];

function createGame(id, roomName) {
  rooms.push({
    roomId: id,
    roomName: roomName,
    connections: [],
  });
}

function findById(roomId) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx != -1) return rooms[idx];
  return null;
}

function getUsers(roomId) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx != -1) return rooms[idx].connections;
  return [];
}

function joinGame(roomId, user) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx != -1) rooms[idx].connections.push(user);
}

function removeUser(roomId, userId) {
  const users = getUsers(roomId);
  const idx = users.findIndex((i) => i.roomId == roomId);
  if (idx != -1) {
    const userIdx = rooms[idx].connections.findIndex((i) => i.id === userId);
    if (userIdx != -1) rooms[idx].connections.splice(userIdx, 1);
  }
}

function updatePoint(id, point) {
  const users = getUsers(roomId);
  const idx = users.findIndex((x) => x.id == id);
  users[idx].point = point;
}

function resetGame(id) {
  const users = getUsers(roomId);
  users = users.map((i) => (i.point = null));
}

export { createGame, findById, joinGame, removeUser, updatePoint, resetGame };

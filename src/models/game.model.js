/* eslint-disable max-len */
const rooms = [
  {
    roomId: '0000000000000000000',
    roomName: 'Test Room',
    connections: [
      {
        userId: '1111111111',
        userName: 'User Test',
        isModerator: false,
        point: null,
      },
    ],
  },
];

/**
 * Creates a new game room and adds it to the list of available rooms.
 *
 * @param {string} roomId - The unique identifier for the game room.
 * @param {string} roomName - The name of the game room.
 * @return {void}
 * @throws {Error} Throws an error if the provided id
 * or roomName is not a string.
 */
function createGame(roomId, roomName) {
  rooms.push({
    roomId: roomId,
    roomName: roomName,
    connections: [],
  });
}

/**
 * Finds a room by its unique identifier.
 *
 * @param {string} roomId - The unique identifier of the room to find.
 * @return {Object|null} - The room object if found, or null if not found.
 */
function findById(roomId) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx != -1) return rooms[idx];
  return null;
}

/**
 * Retrieves the sorted list of connections in a room based on userName.
 *
 * @param {string} roomId - The unique identifier of the room.
 * @return {Array} - An array of connections in the specified room, sorted by userName.
 *                   If the room does not exist, an empty array is returned.
 */
function getUsers(roomId) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx !== -1) {
    // Clone the connections array to avoid modifying the original array
    const connections = [...rooms[idx].connections];

    // Sort the connections by userName
    connections.sort((a, b) => a.userName.localeCompare(b.userName));

    return connections;
  }
  return [];
}

/**
 * Retrieves user information based on the provided room ID and user ID.
 *
 * @param {string} roomId - The ID of the room in which the user is present.
 * @param {string} userId - The ID of the user whose information is to be retrieved.
 * @return {Object|Array} - The user information if found, or null if not found.
 */
function getUser(roomId, userId) {
  const users = getUsers(roomId);
  const idx = users.findIndex((i) => i.userId === userId);
  if (idx != -1) return users[idx];
  return null;
}

/**
 * Joins a user to a game room identified by its roomId.
 *
 * @param {string} roomId - The unique identifier of the game room.
 * @param {object} user - The user object to be added to the room's connections.
 * @return {void}
 */
function joinGame(roomId, user) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx != -1) rooms[idx].connections.push(user);
}

/**
 * Remove a user from the room.
 *
 * @param {string} roomId - O ID da sala da qual o usuário será removido.
 * @param {string} userId - O ID do usuário a ser removido da sala.
 * @return {void}
 */
function removeUser(roomId, userId) {
  const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
  if (roomIndex !== -1) {
    const userIndex = rooms[roomIndex].connections.findIndex((user) => user.userId === userId);
    if (userIndex !== -1) {
      rooms[roomIndex].connections.splice(userIndex, 1);
    }
  }
}

/**
 * Removes a user with the specified userId from all rooms.
 *
 * @param {string} userId - The unique identifier of the user to be removed.
 */
function removeUserById(userId) {
  for (const room of rooms) {
    const userIndex = room.connections.findIndex((user) => user.userId === userId);
    if (userIndex !== -1) {
      room.connections.splice(userIndex, 1);
      break;
    }
  }
}

/**
 * Delete a specific room from the list of rooms.
 *
 * @param {string} roomId - O ID da sala da qual o usuário será removido.
 * @return {void}
 */
function deleteRoom(roomId) {
  const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
  if (roomIndex !== -1) {
    rooms.splice(roomIndex, 1);
  }
}

/**
 * Updates the point for a user in a specific room.
 *
 * @param {string} roomId - The ID of the room.
 * @param {string} userId - The ID of the user.
 * @param {string} point - The new point to assign to the user.
 * @throws {Error} Will throw an error if the provided roomId, userId, or point is falsy.
 * @throws {Error} Will throw an error if the user with the specified roomId and userId is not found.
 */
function updatePoint(roomId, userId, point) {
  if (!roomId || !userId || !point) {
    throw new Error('Invalid arguments. roomId, userId, and point must be provided.');
  }

  const user = getUser(roomId, userId);

  if (!user) {
    throw new Error(`User with roomId ${roomId} and userId ${userId} not found.`);
  }

  user.point = point;
}

/**
 * Resets the game by setting the points of all users
 * in the specified room to null.
 *
 * @param {string} roomId - The identifier of the room where
 * the game is to be reset.
 * @return {void}
 */
function resetGame(roomId) {
  const users = getUsers(roomId);
  users.forEach((user) => {
    user.point = null;
  });
}

/**
 * Checks if a given room is empty.
 *
 * @param {string} roomId - The identifier of the room to be checked.
 * @return {boolean} Returns true if the room is empty (has no users), otherwise false.
 */
function isRoomEmpty(roomId) {
  return (getUsers(roomId).length === 0);
}

/**
 *
 * @param {String} roomId
 * @return {void}
 */
function extractPoints(roomId) {
  const users = getUsers(roomId);

  const points = users
    .filter((user) => user.point !== null && user.point !== undefined)
    .map((user) => user.point);

  return points;
}

export {
  createGame,
  findById,
  joinGame,
  removeUser,
  removeUserById,
  deleteRoom,
  updatePoint,
  resetGame,
  getUsers,
  getUser,
  isRoomEmpty,
  extractPoints,
};

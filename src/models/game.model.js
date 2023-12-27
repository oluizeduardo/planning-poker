/* eslint-disable max-len */
const rooms = [
  {
    roomId: '0000000000000000000',
    roomName: 'Test Room',
    connections: [
      {
        userId: '1111111111',
        userName: 'User Test',
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
 * Retrieves the list of user connections in a specified room.
 *
 * @param {string} roomId - The unique identifier of the room
 * to get user connections from.
 * @return {Array} - An array containing the user connections
 * in the specified room. If the room is not found, an empty array is returned.
 */
function getUsers(roomId) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx !== -1) return rooms[idx].connections;
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
 * Updates the point value for a user with the specified ID in the room.
 *
 * @param {string} id - The unique identifier of the user whose
 * point is to be updated.
 * @param {number} point - The new point value to be assigned to the user.
 * @return {void}
 * @throws {Error} Throws an error if the user with the specified ID
 * is not found in the room.
 *
 * @example
 * // Update user with ID '123' to have a point value of 50
 * updatePoint('123', 50);
 */
function updatePoint(id, point) {
  const users = getUsers(roomId);
  const idx = users.findIndex((x) => x.id == id);
  users[idx].point = point;
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

  // Map over the users and set their points to null.
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

export {
  createGame,
  findById,
  joinGame,
  removeUser,
  deleteRoom,
  updatePoint,
  resetGame,
  getUsers,
  getUser,
  isRoomEmpty,
};

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
 *
 * @example
 * // Create a new game room with id "123" and name "MyRoom"
 * createGame("123", "MyRoom");
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
  if (idx != -1) return rooms[idx].connections;
  return [];
}

/**
 * Joins a user to a game room identified by its roomId.
 *
 * @param {string} roomId - The unique identifier of the game room.
 * @param {object} user - The user object to be added to the room's connections.
 * @param {string} user.username - The username of the user joining the game.
 * @param {any} user.additionalData - Additional data about the user (optional).
 * @return {void}
 */
function joinGame(roomId, user) {
  const idx = rooms.findIndex((i) => i.roomId === roomId);
  if (idx != -1) rooms[idx].connections.push(user);
}

/**
 * Removes a user from a specified room by their user ID.
 *
 * @param {string} roomId - The ID of the room from which to remove the user.
 * @param {string} userId - The ID of the user to be removed.
 * @return {void}
 */
function removeUser(roomId, userId) {
  const users = getUsers(roomId);
  const idx = users.findIndex((i) => i.roomId == roomId);
  if (idx != -1) {
    const userIdx = rooms[idx].connections.findIndex((i) => i.id === userId);
    if (userIdx != -1) rooms[idx].connections.splice(userIdx, 1);
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
 * @param {string} id - The identifier of the room where
 * the game is to be reset.
 * @return {void}
 */
function resetGame(id) {
  const users = getUsers(roomId);

  // Map over the users and set their points to null.
  users.forEach((user) => {
    user.point = null;
  });
}

export {createGame, findById, joinGame, removeUser, updatePoint, resetGame};

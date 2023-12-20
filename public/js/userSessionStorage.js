const KEY_STORAGE = 'p-poker-user';

/**
 * Retrieves the user information from the sessionStorage
 * based on a predefined key.
 *
 * @function
 * @return {string|null} The user information stored in
 * sessionStorage, or null if not found.
 */
function getUser() {
  return sessionStorage.getItem(KEY_STORAGE);
}

/**
 * Saves the user's name to the session storage.
 *
 * @param {string} userName - The name of the user to be saved.
 * @throws {DOMException} If the storage quota is exceeded
 * or if the user denies storage access.
 * @return {void}
 */
function saveUser(userName) {
  sessionStorage.setItem(KEY_STORAGE, userName);
}

/**
 * Clear session storage.
 * Delete all the user names saved.
 */
function clearStorage() {
  sessionStorage.clear();
}

export {getUser, saveUser, clearStorage};

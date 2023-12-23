const KEY_STORAGE = 'p-poker-user-data';

/**
 * Retrieves the user information from the sessionStorage.
 * @return {string|null} The user information stored in
 * sessionStorage, or null if not found.
 */
function getUserData() {
  return sessionStorage.getItem(KEY_STORAGE);
}

/**
 * Saves the user's data to the session storage.
 *
 * @param {string} userData - The user's data to be saved.
 * @throws {DOMException} If the storage quota is exceeded
 * or if the user denies storage access.
 * @return {void}
 */
function saveUserData(userData) {
  sessionStorage.setItem(KEY_STORAGE, userData);
}

/**
 * Clear session storage.
 * Delete all the user names saved.
 */
function clearStorage() {
  sessionStorage.clear();
}

export {
  getUserData,
  saveUserData,
  clearStorage,
};

const KEY_STORAGE = 'p-poker-user-data';

/**
 * Retrieves user data from session storage.
 * @return {Object|null} - User data if found, or null if not found.
 */
function getUserData() {
  const storedData = sessionStorage.getItem(KEY_STORAGE);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
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

const KEY_STORAGE = 'p-poker-user';
const ANONYMOUS_NAME = 'Anonymous';

/**
 * Checks for the presence of a user name.
 * If a user is found, logs the user information;
 * otherwise, prompts the user to enter a user name.
 * @function
 * @return {void}
 */
function checkForUserName() {
  const user = getUser();
  if (user) {
    console.log('Found user:', user);
  } else {
    askForUserName();
  }
}

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
 * Prompts the user to enter their name using a SweetAlert dialog.
 * If the user leaves the input blank, they will be entered as anonymous.
 *
 * @function
 * @name askForUserName
 * @return {void}
 *
 * @example
 * // Call the function to prompt the user for their name
 * askForUserName();
 */
function askForUserName() {
  swal({
    title: 'Write your name',
    text: 'Or leave it blank to enter as anonymous.',
    content: 'input',
    buttons: {
      confirm: true,
    },
  }).then((userName) => {
    if (!userName) userName = ANONYMOUS_NAME;
    saveUser(userName);
  });
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

export {checkForUserName};

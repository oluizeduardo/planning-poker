/* eslint-disable max-len */
import {emitChosenCard} from './socket-front-game.js';
import {getUserData, saveUserData} from './userSessionStorage.js';

const CLASS_CARD_SELECTED = 'card-selected';

const cardElements = document.getElementsByClassName('card');
let selectedCard = null;

Array.from(cardElements).forEach((ele) => {
  ele.addEventListener('click', function() {
    cardClickHandler(ele);
  });
});

/**
 * Handles the click event for a card element.
 * @param {HTMLElement} ele - The clicked card element.
 * @return {void}
 */
function cardClickHandler(ele) {
  removeSelectedCardClass(selectedCard);
  selectedCard = ele;
  addSelectedCardClass(selectedCard);

  const pointInText = ele.querySelector('.card-center-icon').textContent;
  const adjustedText = getAdjustedPoint(pointInText);
  const userData = getUserData();

  if (userData) {
    updateUserData(adjustedText, userData);
    informServerAboutChosenCard(adjustedText, userData);
  } else {
    console.error('User data was not found in Session Storage.');
  }
}

/**
 * Removes the selected card class from a specified card or the previously selected card.
 *
 * @param {HTMLElement|null} card - The DOM element from which to remove the class.
 * @return {void} - This function does not return a value.
 */
function removeSelectedCardClass(card) {
  if (card == null) {
    // It means the page was reloaded, however the selected card was kept.
    removeSelectedCardClassFromPreviousSelectedCard();
  } else {
    card.classList.remove(CLASS_CARD_SELECTED);
  }
}

/**
 * Remove the selected card class from the card that was selected before reload the page.
 */
function removeSelectedCardClassFromPreviousSelectedCard() {
  const {point} = getUserData();
  if (point) {
    const idCard = 'card-'+point;
    document.getElementById(idCard).classList.remove(CLASS_CARD_SELECTED);
  }
}

/**
 * Adds the specified CSS class to a given DOM element's class list.
 *
 * @param {HTMLElement} card - The DOM element to which the class will be added.
 * @throws {TypeError} Will throw an error if the provided parameter is not an HTMLElement.
 */
function addSelectedCardClass(card) {
  card.classList.add(CLASS_CARD_SELECTED);
}

/**
 * Returns the adjusted point based on the provided point text.
 *
 * This function checks if the given point text is '☕' (coffee) and returns 'COFFEE'
 * in that case. Otherwise, it returns the original point text.
 *
 * @param {string} pointText - The text representing a point, typically obtained from a card.
 * @return {string} Adjusted point text. If '☕' is provided, returns 'COFFEE'; otherwise, returns the original text.
 */
function getAdjustedPoint(pointText) {
  return pointText === '☕' ? 'COFFEE' : pointText;
}

/**
 * Updates user data by modifying the 'point' property and saves the updated data.
 *
 * @param {string} point - The new value for the 'point' property.
 * @param {Object} userData - The user data object to be updated.
 * @property {string} userData.userId - The user's unique identifier.
 * @property {string} userData.roomId - The identifier of the room the user is in.
 * @property {string} userData.point - The current value of the user's 'point' property.
 * @return {void}
 */
function updateUserData(point, userData) {
  const updatedUserData = {
    ...userData,
    point: point,
  };
  saveUserData(updatedUserData);
}

/**
 * Informs the server about the chosen card by emitting the chosen card data.
 *
 * @param {string} point - The value associated with the chosen card.
 * @param {Object} userData - User data containing userId and roomId.
 * @param {string} userData.userId - The user identifier.
 * @param {string} userData.roomId - The room identifier.
 * @return {void}
 */
function informServerAboutChosenCard(point, userData) {
  const chosenCardData = {
    userId: userData.userId,
    roomId: userData.roomId,
    point: point,
  };
  emitChosenCard(chosenCardData);
}

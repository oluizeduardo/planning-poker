/* eslint-disable max-len */
import {emitChosenCard} from './socket-front-game.js';
import {getUserData, saveUserData} from './userSessionStorage.js';

const cardElements = document.getElementsByClassName('card');
let selectedCard = null;

const CLASS_CARD_SELECTED = 'card-selected';

Array.from(cardElements).forEach((ele) => {
  ele.addEventListener('click', function() {
    if (selectedCard != null) {
      selectedCard.classList.remove(CLASS_CARD_SELECTED);
    }
    selectedCard = ele;
    selectedCard.classList.add(CLASS_CARD_SELECTED);

    const textDivInsideCard = ele.querySelector('.center-icon').textContent;
    const adjustedText = (textDivInsideCard === '☕') ? 'COFFEE' : textDivInsideCard;
    const userData = getUserData();

    if (userData) {
      const updatedUserData = {
        ...userData,
        point: adjustedText,
      };
      saveUserData(updatedUserData);

      const chosenCardData = {
        userId: userData.userId,
        roomId: userData.roomId,
        point: adjustedText,
      };
      emitChosenCard(chosenCardData);
    } else {
      console.error('User data was not found in Session Storage.');
    }
  });
});

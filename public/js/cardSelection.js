/* eslint-disable max-len */
import {emitChosenCard} from './socket-front-game.js';
import {getUserData, saveUserData} from './userSessionStorage.js';

const cardElements = document.getElementsByClassName('card');

Array.from(cardElements).forEach((ele) => {
  ele.addEventListener('click', function() {
    const textDivInsideCard = ele.querySelector('.center-icon').textContent;

    Array.from(cardElements).forEach((_ele) => {
      const _textDivInsideCard = _ele.querySelector('.center-icon').textContent;

      if (textDivInsideCard === _textDivInsideCard) {
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
      }
    });
  });
});

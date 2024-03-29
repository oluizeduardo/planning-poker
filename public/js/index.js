import {emitCreateRoom, redirectToTheGame} from './socket-front-index.js';
import {clearStorage} from './userSessionStorage.js';

const form = document.getElementById('form-add-room');
const inputRoomName = document.getElementById('input-room-name');
const selectVotingSystem = document.getElementById('select-voting-system');
const linkConnectRoom = document.getElementById('linkConnectRoom');

window.addEventListener('load', () => {
  clearStorage();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const roomName = inputRoomName.value;
  const votingSystem = selectVotingSystem.value;

  if (roomName && votingSystem > 0) {
    emitCreateRoom(roomName);
    inputRoomName.value = '';
  } else {
    swal({
      title: '',
      text: 'Please, inform the room\'s name and the voting system.',
      icon: 'warning',
    });
  }
});

linkConnectRoom.addEventListener('click', (e) => {
  swal({
    text: 'Please, inform the room id.',
    content: 'input',
    buttons: {
      cancel: true,
      confirm: true,
    },
  }).then((roomId) => {
    if (roomId) {
      redirectToTheGame(roomId);
    }
  });
});

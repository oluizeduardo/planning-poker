import {emitConnectWithRoom, emitCreateRoom} from './socket-front-index.js';

const form = document.getElementById('form-add-room');
const inputRoomName = document.getElementById('input-room-name');
const selectVotingSystem = document.getElementById('select-voting-system');
const linkConnectRoom = document.getElementById('linkConnectRoom');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const roomName = inputRoomName.value;
  const indexVotingSystem = selectVotingSystem.selectedIndex;

  if (roomName && indexVotingSystem > 0) {
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
      emitConnectWithRoom(roomId);
    }
  });
});

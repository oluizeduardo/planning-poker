import { emitConnectWithRoom } from "./socket-front-game.js";
import { checkForUserName } from "./userSessionStorage.js";

const btnLogOut = document.getElementById("btnLogOut");
const btnInvitePlayers = document.getElementById("btnInvitePlayers");
const roomNameLabel = document.getElementById("room-name");

window.addEventListener("load", (event) => {
  checkForUserName();
});

btnLogOut.addEventListener("click", (e) => {
  swal({
    title: "Leave the room?",
    text: "This room will be available as long as there are participants.",
    icon: "warning",
    buttons: ["Cancel", "Yes, leave it!"],
    dangerMode: true,
  }).then((confirmExit) => {
    if (confirmExit) {
      window.location.href = "/";
    }
  });
});

btnInvitePlayers.addEventListener("click", (e) => {
  const text = getRoomId();
  const message = `Share this code with your teammates and start playing!\n\n${text}`;
  swal("Invite players", message);
});

function connectIntheRoom() {
  emitConnectWithRoom(getRoomId(), (roomName) => {
    roomNameLabel.innerText = roomName;
  });
}

function getRoomId() {
  return getValueFromParameter("id");
}

function getValueFromParameter(parameter) {
  const urlObject = new URL(window.location.href);
  const parameters = urlObject.searchParams;
  return parameters.get(parameter);
}

connectIntheRoom();

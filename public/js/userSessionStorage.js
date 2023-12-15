const KEY_STORAGE = "p-poker-user";
const ANONYMOUS_NAME = "Anonymous";

function checkForUserName() {
  const user = getUser();
  if (user) {
    console.log("Found user:", user);
  } else {
    askForUserName();
  }
}

function getUser() {
  return sessionStorage.getItem(KEY_STORAGE);
}

function askForUserName() {
  swal({
    title: "Write your name",
    text: "Leave blank to enter as anonymous.",
    content: "input",
    buttons: {
      confirm: true,
    },
  }).then((userName) => {
    if (!userName) userName = ANONYMOUS_NAME;
    saveUser(userName);
  });
}

function saveUser(userName) {
  sessionStorage.setItem(KEY_STORAGE, userName);
}

export { checkForUserName };

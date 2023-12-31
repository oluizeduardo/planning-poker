const checkDarkMode = document.getElementById('checkDarkMode');
const headerElement = document.getElementById('el_header');
const roomName = document.getElementById('room-name');

const SESSION_STORAGE_NAME = 'backgroundMode';

const backgroundMode = sessionStorage.getItem(SESSION_STORAGE_NAME);

if (backgroundMode) {
  document.body.classList.toggle('dark', backgroundMode === 'dark');
  headerElement.classList.toggle('bg-light', backgroundMode === 'light');
  headerElement.classList.toggle('bg-dark', backgroundMode === 'dark');
  roomName.classList.toggle('text-white', backgroundMode === 'dark');

  if (backgroundMode === 'dark') {
    checkDarkMode.checked = true;
  }
}

checkDarkMode.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  headerElement.classList.toggle('bg-light');
  headerElement.classList.toggle('bg-dark');
  roomName.classList.toggle('text-white');

  const newMode = document.body.classList.contains('dark') ? 'dark' : 'light';
  sessionStorage.setItem(SESSION_STORAGE_NAME, newMode);
});

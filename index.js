import { startManageUserInputs } from './app_modules/keyPress.js';
import { buildText } from './app_modules/textBuilder.js';

document.addEventListener('keypress', (event) => {
  if (event.keyCode == 32 && event.target == document.body) {
    event.preventDefault();
  }
});

const keySets = {
  one: 'qwert',
  two: 'yuiop',
  three: 'asdfg',
  four: 'hjklç',
  five: 'zxcvb',
  six: 'nm,.;',
  seven: 'qwertasdfgzxcvb',
  eight: 'yuiophjklçnm,.;',
  ten: 'qwertyuiop',
  eleven: 'asdfghjklç',
  twelve: 'zxcvbnm,.;',
  thirteen: 'qwertyuiopasdfghjklçzxcvbnm,.;'
};

const screens = document.getElementsByClassName('hero');

function toggleScreen() {
  [...screens].map((i) => {
    if (i.classList.contains('is-hidden')) {
      i.classList.remove('is-hidden');
    } else {
      i.classList.add('is-hidden');
    }
  })
}

const closeButton = document.getElementById('close-button');

closeButton.addEventListener('click', toggleScreen);

buildText(keySets.thirteen);
// startManageUserInputs();

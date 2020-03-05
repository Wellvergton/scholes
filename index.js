import {
  startManageUserInputs, stopManageUserInputs,
  setElementsToBePressed, restartManageUserInputs
} from './app_modules/keyPress.js';
import {
  screenProxyBuilder, setScreens, toggleScreen
} from './app_modules/screenManager.js';

document.addEventListener('keypress', (event) => {
  if (event.code == 'Space' && event.target == document.body) {
    event.preventDefault();
  }
});

document.addEventListener('focusin', (event) => {
  if (event.target.tagName == 'BUTTON') {
    event.target.blur();
  }
});

let closeButton = document.getElementById('close-button');
closeButton.addEventListener('click', toggleScreen);

setScreens(document.getElementsByClassName('hero'));

let previousButton = document.getElementById('previous-button');
let nexButton = document.getElementById('next-button');

let screenProxyArgs = {
  textId: 'text',
  charsClass: 'keys',
  previousButton: previousButton,
  nexButton: nexButton
}
let screenProxy = screenProxyBuilder(screenProxyArgs);
screenProxy.lessonIndex = 0;

previousButton.addEventListener('click', () => {
  restartManageUserInputs();
  --screenProxy.lessonIndex;
});

nexButton.addEventListener('click', () => {
  restartManageUserInputs();
  ++screenProxy.lessonIndex;
});

setElementsToBePressed('keys');
startManageUserInputs();

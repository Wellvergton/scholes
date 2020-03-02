import { startManageUserInputs } from './app_modules/keyPress.js';
import { lessonProxy } from './app_modules/screenManager.js';

document.addEventListener('keypress', (event) => {
  if (event.keyCode == 32 && event.target == document.body) {
    event.preventDefault();
  }
});

lessonProxy.lessonIndex = 0;

// startManageUserInputs();

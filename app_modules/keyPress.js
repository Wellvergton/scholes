export {
  startManageUserInputs, stopManageUserInputs,
  setElementsToBePressed, restartManageUserInputs,
  setFingerIndicator, setErrorCounter
}

import { startTimer, stopTimer } from './timer.js';

function isTheCorrectKey(keyPressed, expectedKey) {
  if (keyPressed == 'Enter' && expectedKey == '\u21B5') {
    return true;
  } else {
    return keyPressed == expectedKey;
  }
}

let keysToBePressed;

function setElementsToBePressed(className) {
  keysToBePressed = document.getElementsByClassName(className);
}

let position = 0;

function markPressedKey(key) {
  return new Promise((resolve) => {
    if (isTheCorrectKey(key, keysToBePressed[position].innerHTML)) {
      keysToBePressed[position].classList.add('has-background-success');
    } else {
      keysToBePressed[position].classList.add('has-background-danger');
    }
    resolve();
  });
}

let errorCount = 0;

let errorCounter;
function setErrorCounter(element) {
  errorCounter = element;
}

const fingers = {
  leftPinky: {
    chars: 'qaz',
    positionOnScreen: 'top: 22.4rem; left: 3.5rem;',
  },
  leftRingFinger: {
    chars: 'wsx',
    positionOnScreen: 'top: 21rem; left: 4.86rem;',
  },
  leftMiddleFinger: {
    chars: 'edc',
    positionOnScreen: 'top: 20.4rem; left: 6.25rem;',
  },
  leftIndexFinger: {
    chars: 'rfvtgb',
    positionOnScreen: 'top: 21rem; left: 7.63rem;',
  },
  leftThumb: {
    chars: ' ',
    positionOnScreen: 'top: 24.4rem; left: 9.23rem;',
  },
  rightPinky: {
    chars: 'pç;\u21B5',
    positionOnScreen: 'top: 22.4rem; right: 3.5rem;',
  },
  rightRingFinger: {
    chars: 'ol.',
    positionOnScreen: 'top: 21rem; right: 4.86rem;',
  },
  rightMiddleFinger: {
    chars: 'ik,',
    positionOnScreen: 'top: 20.4rem; right: 6.25rem;',
  },
  rightIndexFinger: {
    chars: 'ujmyhn',
    positionOnScreen: 'top: 21rem; right: 7.63rem;',
  },
}

let fingerIdicator;

function setFingerIndicator(element) {
  fingerIdicator = element;
}

function indicateTheCorrectFinger(char) {
  for (let finger in fingers) {
    if (fingers[finger].chars.includes(char)) {
      fingerIdicator.style = fingers[finger].positionOnScreen;
    }
  }
}

function startManageUserInputs() {
  indicateTheCorrectFinger(keysToBePressed[0].innerHTML);
  document.addEventListener('keypress', manageUserInput);
}

function restartManageUserInputs() {
  indicateTheCorrectFinger(keysToBePressed[0].innerHTML);
  position = 0;
  errorCount = 0;
  errorCounter.innerHTML = errorCount;
  document.addEventListener('keypress', manageUserInput);
}

function stopManageUserInputs() {
  position = 0;
  errorCount = 0;
  errorCounter.innerHTML = errorCount;
  document.removeEventListener('keypress', manageUserInput);
}

async function manageUserInput(keypress) {
  startTimer();
  await markPressedKey(keypress.key);
  if (!isTheCorrectKey(keypress.key, keysToBePressed[position].innerHTML)) {
    errorCount++;
    errorCounter.innerHTML = errorCount;
  }
  position++;
  if (position == keysToBePressed.length) {
    stopTimer();
    stopManageUserInputs();
  }
  indicateTheCorrectFinger(keysToBePressed[position].innerHTML);
}

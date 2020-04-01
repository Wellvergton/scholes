export {
  startManageUserInputs, stopManageUserInputs,
  setElementsToBeTyped, setFingerIndicator,
  setErrorCounter, setHandsData
}

import { startTimer, stopTimer } from './timer.js';

function isTheCorrectKey(keyTyped, expectedKey) {
  if (keyTyped == 'Enter' && expectedKey == '\u21B5') {
    return true;
  } else {
    return keyTyped == expectedKey;
  }
}

let noMoreKeys = new Event('no-more-keys');

let keysToBeTyped;

function setElementsToBeTyped(className) {
  keysToBeTyped = document.getElementsByClassName(className);
}

let position = 0;

function markTypedKey(key) {
  let elementToCompare = keysToBeTyped[position];

  return new Promise((resolve) => {
    if (isTheCorrectKey(key, elementToCompare.innerHTML)) {
      elementToCompare.classList.add('has-background-success');
    } else {
      elementToCompare.classList.add('has-background-danger');
    }

    resolve();
  });
}

let errorCount = 0;
let errorCounter;

function setErrorCounter(element) {
  errorCounter = element;
}

let top;
let left;
let right;
let Fingers;

function setHandsData(leftHand, rightHand) {
  top = leftHand.getBoundingClientRect().top;
  left = leftHand.getBoundingClientRect().left;
  right = rightHand.getBoundingClientRect().right;

  Fingers = {
    leftPinky: {
      chars: 'qaz',
      positionOnScreen: `top: ${top + 34.5}px; left: ${left + 2.125}px;`,
    },
    leftRingFinger: {
      chars: 'wsx',
      positionOnScreen: `top: ${top + 12.5}px; left: ${left + 24.025}px;`,
    },
    leftMiddleFinger: {
      chars: 'edc',
      positionOnScreen: `top: ${top + 2.5}px; left: ${left + 46.125}px;`,
    },
    leftIndexFinger: {
      chars: 'rfvtgb',
      positionOnScreen: `top: ${top + 12.5}px; left: ${left + 68.125}px;`,
    },
    leftThumb: {
      chars: ' ',
      positionOnScreen: `top: ${top + 66}px; left: ${left + 93.625}px;`,
    },
    rightPinky: {
      chars: 'pç;\u21B5',
      positionOnScreen: `top: ${top + 34.5}px; right: ${right - 1241.625}px;`,
    },
    rightRingFinger: {
      chars: 'ol.',
      positionOnScreen: `top: ${top + 12.5}px; right: ${right - 1219.625}px;`,
    },
    rightMiddleFinger: {
      chars: 'ik,',
      positionOnScreen: `top: ${top + 2.5}px; right: ${right - 1197.625}px;`,
    },
    rightIndexFinger: {
      chars: 'ujmyhn',
      positionOnScreen: `top: ${top + 12.5}px; right: ${right - 1175.425}px;`,
    },
  }
}

let fingerIdicator;

function setFingerIndicator(element) {
  fingerIdicator = element;
}

function indicateTheCorrectFinger(char) {
  for (let finger in Fingers) {
    if (Fingers[finger].chars.includes(char)) {
      fingerIdicator.style = Fingers[finger].positionOnScreen;
    }
  }
}

function restartCounters() {
  position = 0;
  errorCount = 0;
  errorCounter.innerHTML = errorCount;
}

function startManageUserInputs() {
  indicateTheCorrectFinger(keysToBeTyped[0].innerHTML);
  restartCounters();
  document.addEventListener('keypress', manageUserInput);
}

function stopManageUserInputs() {
  document.removeEventListener('keypress', manageUserInput);
}

async function manageUserInput(keypress) {
  startTimer();
  await markTypedKey(keypress.key);
  if (!isTheCorrectKey(keypress.key, keysToBeTyped[position].innerHTML)) {
    errorCount++;
    errorCounter.innerHTML = errorCount;
  }

  position++;

  if (position == keysToBeTyped.length) {
    stopTimer();
    stopManageUserInputs();

    document.dispatchEvent(noMoreKeys);

    return;
  }

  indicateTheCorrectFinger(keysToBeTyped[position].innerHTML);
}

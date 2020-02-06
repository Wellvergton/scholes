export { startManageUserInputs }

function isTheCorrectKey(keyPressed, expectedKey) {
  if (keyPressed == 'Enter' && expectedKey == '↵') {
    return true;
  } else {
    return keyPressed == expectedKey;
  }
}

let elementsWithKeys = document.getElementsByClassName('key');
let position = 0;

function markPressedKey(key) {
  return new Promise(resolve => {
    if (isTheCorrectKey(key, elementsWithKeys[position].innerHTML)) {
      elementsWithKeys[position].style.color = 'green'
      resolve('Right');
    } else {
      elementsWithKeys[position].style.color = 'red'
      resolve('Wrong');
    }
  });
}

let errorsByKey = {};

function recordErrorsByKey(key) {
  errorsByKey[key] ? errorsByKey[key]++ : errorsByKey[key] = 1;
}

function clearErrorsByKey() {
  errorsByKey = {};
}

function getErrorsCount() {
  return Object.values(errorsByKey).reduce((acc, value) => {
    return acc + value;
  });
}

function startManageUserInputs() {
  document.addEventListener('keypress', manageUserInput);
}

function stopManageUserInputs() {
  document.removeEventListener('keypress', manageUserInput);
}

async function manageUserInput(keypress) {
  let markingResult = await markPressedKey(keypress.key);
  if (markingResult == 'Wrong') recordErrorsByKey(keypress.key);
  position++;
  if (position == elementsWithKeys.length) {
    position = 0;
    stopManageUserInputs();
  }
}

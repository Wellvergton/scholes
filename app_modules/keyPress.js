export { startManageUserInputs, stopManageUserInputs, setElementsToBePressed }

function isTheCorrectKey(keyPressed, expectedKey) {
  if (keyPressed == 'Enter' && expectedKey == '↵') {
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
      keysToBePressed[position].classList.add("has-text-success");
      resolve();
    } else {
      keysToBePressed[position].classList.add("has-text-danger");
      resolve();
    }
  });
}

function startManageUserInputs() {
  document.addEventListener('keypress', manageUserInput);
}

function stopManageUserInputs() {
  document.removeEventListener('keypress', manageUserInput);
}

async function manageUserInput(keypress) {
  await markPressedKey(keypress.key);
  position++;
  if (position == keysToBePressed.length) {
    position = 0;
    stopManageUserInputs();
  }
}

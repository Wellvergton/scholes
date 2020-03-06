import { buildText } from './textBuilder.js';

export { screenProxyBuilder, setScreens, toggleScreen, keySets }

let screens;

function setScreens(elements) {
  screens = elements;
}

function toggleScreen() {
  for (let screen of screens) {
    if (screen.classList.contains('is-hidden')) {
      screen.classList.remove('is-hidden');
    } else {
      screen.classList.add('is-hidden');
    }
  }
}

function disableButton(button) {
  button.setAttribute('disabled', 'disabled');
}

function enableButton(button) {
  button.removeAttribute('disabled');
}

let keySets = {
  1: 'qwert',
  2: 'yuiop',
  3: 'asdfg',
  4: 'hjklç',
  5: 'zxcvb',
  6: 'nm,.;',
  7: 'qwertasdfgzxcvb',
  8: 'yuiophjklçnm,.;',
  9: 'qwertyuiop',
  10: 'asdfghjklç',
  11: 'zxcvbnm,.;',
  12: 'qwertyuiopasdfghjklçzxcvbnm,.;'
};

function screenProxyBuilder(argsObj) {
  let {textId, charsClass, previousButton, nexButton} = argsObj;
  let proxyTarget = { lessonIndex: 1 };
  let proxyHandler = {
    set: (target, prop, value) => {
      if (prop == 'lessonIndex') {
        if (value == 1) {
          disableButton(previousButton);
          enableButton(nexButton);
        } else if (value == 12) {
          disableButton(nexButton);
          enableButton(previousButton);
        } else {
          enableButton(nexButton);
          enableButton(previousButton);
        }
      }

      target[prop] = value;

      buildText(keySets[value], textId, charsClass);

      return true;
    }
  }

  return new Proxy(proxyTarget, proxyHandler);
}

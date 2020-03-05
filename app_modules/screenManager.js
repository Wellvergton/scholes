import { buildText } from './textBuilder.js';

export { screenProxyBuilder, setScreens, toggleScreen }

let screens;

function setScreens(elems) {
  screens = elems;
}

function toggleScreen() {
  [...screens].map((i) => {
    if (i.classList.contains('is-hidden')) {
      i.classList.remove('is-hidden');
    } else {
      i.classList.add('is-hidden');
    }
  })
}

function disableButton(button) {
  button.setAttribute('disabled', 'disabled');
}

function enableButton(button) {
  button.removeAttribute('disabled');
}

let keySets = {
  0: 'qwert',
  1: 'yuiop',
  2: 'asdfg',
  3: 'hjklç',
  4: 'zxcvb',
  5: 'nm,.;',
  6: 'qwertasdfgzxcvb',
  7: 'yuiophjklçnm,.;',
  8: 'qwertyuiop',
  9: 'asdfghjklç',
  10: 'zxcvbnm,.;',
  11: 'qwertyuiopasdfghjklçzxcvbnm,.;'
};

function screenProxyBuilder(argsObj) {
  let {textId, charsClass, previousButton, nexButton} = argsObj;
  let proxyTarget = { lessonIndex: 0 };
  let proxyHandler = {
    set: (target, prop, value) => {
      if (prop == 'lessonIndex') {
        if (value == 0) {
          disableButton(previousButton);
          enableButton(nexButton);
        } else if (value == 11) {
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

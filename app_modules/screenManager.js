import TextBuider from './textBuilder.js';

export default function screenManager(screenElements) {
  let Text = new TextBuider();

  function toggleScreen() {
    for (let screen of screenElements) {
      screen.classList.toggle('is-hidden');
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

  function homeScreenProxyBuilder(argsObj) {
    let {previousButton, nextButton} = argsObj;
    let proxyTarget = { currentLowestIndex: 1 }
    let proxyHandler = {
      set: (target, prop, value) => {
        if (prop == 'currentLowestIndex') {
          if (value <= 3) {
            disableButton(previousButton);
            enableButton(nextButton);
          } else if (value >= 10) {
            disableButton(nextButton);
            enableButton(previousButton);
          } else {
            enableButton(previousButton);
            enableButton(nextButton);
          }
        }

        target[prop] = value;

        return true;
      }
    }

    return new Proxy(proxyTarget, proxyHandler);
  }

  function lessonScreenProxyBuilder(argsObj) {
    let {textId, charsClass, previousButton, nextButton} = argsObj;
    let proxyTarget = { lessonIndex: 1 };
    let proxyHandler = {
      set: (target, prop, value) => {
        if (prop == 'lessonIndex') {
          if (value == 1) {
            disableButton(previousButton);
            enableButton(nextButton);
          } else if (value == 12) {
            disableButton(nextButton);
            enableButton(previousButton);
          } else {
            enableButton(nextButton);
            enableButton(previousButton);
          }
        }

        target[prop] = value;

        Text.build(keySets[value], textId, charsClass);

        return true;
      }
    }

    return new Proxy(proxyTarget, proxyHandler);
  }

  return {
    lessonScreenProxyBuilder, homeScreenProxyBuilder, toggleScreen, keySets
  }
}

import { buildText } from './textBuilder.js';

export { lessonProxy }

const keySets = {
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

function disableButton(button) {
  button.setAttribute('disabled', 'disabled');
}

function enableButton(button) {
  button.removeAttribute('disabled');
}

let previousButton = document.getElementById('previous-button');
let nexButton = document.getElementById('next-button');

let proxyTarget = { lessonIndex: -1 };
let proxyHandler = {
  set: (target, prop, value) => {
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

    target[prop] = value;

    buildText(keySets[value]);

    return true;
  }
}
let lessonProxy = new Proxy(proxyTarget, proxyHandler);

previousButton.addEventListener('click', () => {
  --lessonProxy.lessonIndex;
});

nexButton.addEventListener('click', () => {
  ++lessonProxy.lessonIndex;
});

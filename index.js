import {
  startManageUserInputs, stopManageUserInputs,
  setElementsToBeTyped, setFingerIndicator,
  setErrorCounter, setHandsData
} from './app_modules/keyPressManager.js';

import recordsManager from './app_modules/records.js';

import {
  lessonScreenProxyBuilder, homeScreenProxyBuilder, setScreens, toggleScreen,
  keySets
} from './app_modules/screenManager.js';

import {
  setTimerElement, clearScreenTimer
} from './app_modules/timer.js';

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

setScreens(document.getElementsByClassName('hero'));

let aboutModal = document.querySelector('.modal');

function toggleAboutModal() {
  aboutModal.classList.toggle('is-active');
}

let aboutButton = document.querySelector('.navbar-item > .button.is-info');

aboutButton.addEventListener('click', toggleAboutModal);

aboutModal.addEventListener('click', (event) => {
  let classList = event.target.classList;

  if (classList.contains('delete') || classList.contains('modal-background')) {
    toggleAboutModal();
  } else if (event.target.tagName == 'A') {
    event.preventDefault();
    openLinkInOSBrowser(event.target.href);
  }
});

let lessonIndexes = document.getElementsByClassName('pagination-link');
let currentLesson = parseInt(lessonIndexes[0].innerHTML);

function setCurrentLesson(lessonNumber) {
  currentLesson = parseInt(lessonNumber);
}

function isCurrentLessonOnTheScreen() {
  return [...lessonIndexes].some((index) => {
    return index.innerHTML == currentLesson;
  });
}

function markCurrentLessonSelectedButton() {
  for (let index of lessonIndexes) {
    if (parseInt(index.innerHTML) == currentLesson) {
      index.classList.add('is-current');
    }
  }
}

function unmarkLessonSelectedButtons() {
  for (let index of lessonIndexes) {
    if (index.classList.contains('is-current')) {
      index.classList.remove('is-current');
    }
  }
}

function setLessonNameOnScreen() {
  let element = document.querySelector('.content > p');
  element.innerHTML = keySets[currentLesson].toUpperCase();
}

setLessonNameOnScreen();

let pagination = document.querySelector('nav.pagination');

pagination.addEventListener('click', (event) => {
  let classList = event.target.classList;

  if (classList.contains('pagination-link')) {
    unmarkLessonSelectedButtons();
    setCurrentLesson(event.target.innerHTML);
    markCurrentLessonSelectedButton();
    setLessonNameOnScreen();
  } else if (classList.contains('pagination-previous')) {
    decreaseLessonIndexes();
  } else if (classList.contains('pagination-next')) {
    increaseLessonIndexes();
  }

  organizeLessonSelector();
});

let homeScreenProxyArgs = {
  previousButton: document.querySelector('.pagination-previous'),
  nextButton: document.querySelector('.pagination-next')
};
let homeScreenProxy = homeScreenProxyBuilder(homeScreenProxyArgs);

homeScreenProxy.currentLowestIndex = 1;

function decreaseLessonIndexes() {
  if (parseInt(lessonIndexes[0].innerHTML) >= 4) {
    for (let index of lessonIndexes) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value - 3;
    }
  }
}

function organizeLessonSelector() {
  unmarkLessonSelectedButtons();
  homeScreenProxy.currentLowestIndex = parseInt(lessonIndexes[0].innerHTML);

  if (isCurrentLessonOnTheScreen()) {
    markCurrentLessonSelectedButton();
  }
}

function increaseLessonIndexes() {
  if (parseInt(lessonIndexes[2].innerHTML) <= 9) {
    for (let index of lessonIndexes) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value + 3;
    }
  }
}

let leftHand = document.getElementById('left-hand');
let rightHand = document.getElementById('right-hand');
let startButton = document.querySelector('.card-footer button.button');

startButton.addEventListener('click', async () => {
  await maximizeWindow();
  toggleScreen();
  lessonScreenProxy.lessonIndex = currentLesson;
  setHandsData(leftHand, rightHand);
  startManageUserInputs();
});

let closeLessonButton = document.getElementById('close-button');

closeLessonButton.addEventListener('click', () => {
  unmarkLessonSelectedButtons();
  markCurrentLessonSelectedButton();
  setLessonNameOnScreen();
  unmaximizeWindow();
  stopManageUserInputs();
  toggleScreen();
  clearScreenTimer();
});

function hasPlayerAlreadyTyped() {
  let firstChar = document.querySelector('.keys');
  return firstChar.classList.contains('has-background-success') ||
    firstChar.classList.contains('has-background-danger');
}

let previousLessonButton = document.getElementById('previous-button');
let nextLessonButton = document.getElementById('next-button');
let lessonNavBar = document.querySelector('.hero-head .navbar .navbar-menu');

lessonNavBar.addEventListener('mouseover', (event) => {
  if (event.target.tagName == 'BUTTON' && hasPlayerAlreadyTyped()) {
    event.target.classList.add('is-danger');
  }
});

['mouseout', 'click'].forEach((evt) => {
  lessonNavBar.addEventListener(evt, (event) => {
    if (event.target.tagName == 'BUTTON') {
      event.target.classList.remove('is-danger');
    }
  });
});

let lessonScreenProxyArgs = {
  textId: 'text',
  charsClass: 'keys',
  previousButton: previousLessonButton,
  nextButton: nextLessonButton
}
let lessonScreenProxy = lessonScreenProxyBuilder(lessonScreenProxyArgs);

lessonScreenProxy.lessonIndex = 1;

function changeLessonOnScreen() {
  setCurrentLesson(lessonScreenProxy.lessonIndex);
  clearScreenTimer();
  setHandsData(leftHand, rightHand);
  startManageUserInputs();
}

previousLessonButton.addEventListener('click', () => {
  --lessonScreenProxy.lessonIndex;
  changeLessonOnScreen();
});

nextLessonButton.addEventListener('click', () => {
  ++lessonScreenProxy.lessonIndex;
  changeLessonOnScreen();
});

setElementsToBeTyped('keys');

let errorCounter = document.querySelector('.hero-foot .level-item:first-child .title');

setErrorCounter(errorCounter);

let dot = document.querySelector('.fas.fa-circle.has-text-success');

setFingerIndicator(dot);

let timer = document.querySelector('.hero-foot .level-item:last-child .title');

setTimerElement(timer);


let records = new recordsManager({
  timer: timer,
  errorCounter: errorCounter,
})

document.addEventListener('no-more-keys', () => {
  records.save(lessonScreenProxy.lessonIndex);
});

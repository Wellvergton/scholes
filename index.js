import {
  startManageUserInputs, stopManageUserInputs,
  setElementsToBeTyped, setFingerIndicator,
  setErrorCounter, setHandsData
} from './app_modules/keyPressManager.js';

import {
  lessonScreenProxyBuilder, homeScreenProxyBuilder, setScreens, toggleScreen,
  keySets
} from './app_modules/screenManager.js';

import {
  setTimerElement, restartScreenTimer
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

let aboutModalCloseButton = document.querySelector('.modal-card-head > .delete');
aboutModalCloseButton.addEventListener('click', toggleAboutModal);

let aboutModalBackGround = document.querySelector('.modal-background');
aboutModalBackGround.addEventListener('click', toggleAboutModal);

let externalLinks = document.querySelectorAll('a[href]');
for (let anchor of externalLinks) {
  anchor.addEventListener('click', () => {
    event.preventDefault();
    openLinkInOSBrowser(event.target.href);
  });
}

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

function markCurrentLessonSelectButton() {
  for (let index of lessonIndexes) {
    if (parseInt(index.innerHTML) == currentLesson) {
      index.classList.add('is-current');
    }
  }
}

function unmarkLessonSelectButtons() {
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

for (let index of lessonIndexes) {
  index.addEventListener('click', () => {
    unmarkLessonSelectButtons();
    setCurrentLesson(event.target.innerHTML);
    markCurrentLessonSelectButton();
    setLessonNameOnScreen();
  });
}

let homeScreenPreviousButton = document.querySelector('.pagination-previous');
let homeScreenNextButton = document.querySelector('.pagination-next');

let homeScreenProxyArgs = {
  previousButton: homeScreenPreviousButton,
  nextButton: homeScreenNextButton
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
  unmarkLessonSelectButtons();
  homeScreenProxy.currentLowestIndex = parseInt(lessonIndexes[0].innerHTML);
  if (isCurrentLessonOnTheScreen()) {
    markCurrentLessonSelectButton();
  }
}

homeScreenPreviousButton.addEventListener('click', () => {
  decreaseLessonIndexes();
  organizeLessonSelector();
});

function increaseLessonIndexes() {
  if (parseInt(lessonIndexes[2].innerHTML) <= 9) {
    for (let index of lessonIndexes) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value + 3;
    }
  }
}

homeScreenNextButton.addEventListener('click', () => {
  increaseLessonIndexes();
  organizeLessonSelector();
});

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

let closeButton = document.getElementById('close-button');
closeButton.addEventListener('click', () => {
  unmarkLessonSelectButtons();
  markCurrentLessonSelectButton();
  setLessonNameOnScreen();
  unmaximizeWindow();
  stopManageUserInputs();
  toggleScreen();
  restartScreenTimer();
});

function hasPlayerAlreadyTyped() {
  let firstChar = document.querySelector('.keys');
  return firstChar.classList.contains('has-background-success') ||
    firstChar.classList.contains('has-background-danger');
}

let lessonPreviousButton = document.getElementById('previous-button');
let lessonNextButton = document.getElementById('next-button');

let lessonButtons = [closeButton, lessonPreviousButton, lessonNextButton];

for (let button of lessonButtons) {
  button.style.transition = 'background-color 0.3s linear 0s';
  button.addEventListener('mouseover', () => {
    if (hasPlayerAlreadyTyped()) {
      event.target.classList.add('is-danger');
    }
  });
  button.addEventListener('mouseout', () => {
    event.target.classList.remove('is-danger');
  });
  button.addEventListener('click', () => {
    event.target.classList.remove('is-danger');
  });
}

let lessonScreenProxyArgs = {
  textId: 'text',
  charsClass: 'keys',
  previousButton: lessonPreviousButton,
  nextButton: lessonNextButton
}
let lessonScreenProxy = lessonScreenProxyBuilder(lessonScreenProxyArgs);
lessonScreenProxy.lessonIndex = 1;

function changeLessonOnScreen() {
  setCurrentLesson(lessonScreenProxy.lessonIndex);
  restartScreenTimer();
  setHandsData(leftHand, rightHand);
  startManageUserInputs();
}

lessonPreviousButton.addEventListener('click', () => {
  --lessonScreenProxy.lessonIndex;
  changeLessonOnScreen();
});

lessonNextButton.addEventListener('click', () => {
  ++lessonScreenProxy.lessonIndex;
  changeLessonOnScreen();
});

setElementsToBeTyped('keys');

let errorCounter = document.querySelector('.hero-foot .level-item .title');
setErrorCounter(errorCounter);

let dot = document.querySelector('.fas.fa-circle.has-text-success');

setFingerIndicator(dot);

let timer = document.querySelector('.hero-foot .level-item:last-child .title');
setTimerElement(timer);

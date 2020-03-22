import {
  startManageUserInputs, stopManageUserInputs,
  setElementsToBePressed, restartManageUserInputs,
  setFingerIndicator
} from './app_modules/keyPress.js';
import {
  lessonScreenProxyBuilder, homeScreenProxyBuilder, setScreens, toggleScreen,
  keySets
} from './app_modules/screenManager.js';

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

let lessonIndexes = document.getElementsByClassName('pagination-link');

let modal = document.querySelector('.modal');

function toggleModal() {
  modal.classList.toggle('is-active');
}

let aboutButton = document.querySelector('.navbar-item > .button.is-info');
aboutButton.addEventListener('click', toggleModal);

let modalCloseButton = document.querySelector('.modal-card-head > .delete');
modalCloseButton.addEventListener('click', toggleModal);

let modalBackGround = document.querySelector('.modal-background');
modalBackGround.addEventListener('click', toggleModal);

let externalLinks = document.querySelectorAll('a[href]');
for (let anchor of externalLinks) {
  anchor.addEventListener('click', () => {
    event.preventDefault();
    openLinkInOSBrowser(event.target.href);
  });
}

let currentLesson = parseInt(lessonIndexes[0].innerHTML);

function setCurrentLesson(lessonNumber) {
  currentLesson = parseInt(lessonNumber);
}

function isCurrentLessonOnTheScreen() {
  return [...lessonIndexes].some((index) => {
    return index.innerHTML == currentLesson;
  });
}

function markCurrentLessonButton() {
  for (let index of lessonIndexes) {
    if (parseInt(index.innerHTML) == currentLesson) {
      index.classList.add('is-current');
    }
  }
}

function unmarkButtons() {
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
    unmarkButtons();
    setCurrentLesson(event.target.innerHTML);
    markCurrentLessonButton();
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

function decreasePaginationLinks() {
  if (parseInt(lessonIndexes[0].innerHTML) >= 4) {
    for (let index of lessonIndexes) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value - 3;
    }
  }
}

homeScreenPreviousButton.addEventListener('click', () => {
  unmarkButtons();
  decreasePaginationLinks();
  homeScreenProxy.currentLowestIndex = parseInt(lessonIndexes[0].innerHTML);
  if (isCurrentLessonOnTheScreen()) {
    markCurrentLessonButton();
  }
});

function increasePaginationLinks() {
  if (parseInt(lessonIndexes[2].innerHTML) <= 9) {
    for (let index of lessonIndexes) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value + 3;
    }
  }
}

homeScreenNextButton.addEventListener('click', () => {
  unmarkButtons();
  increasePaginationLinks();
  homeScreenProxy.currentLowestIndex = parseInt(lessonIndexes[0].innerHTML);
  if (isCurrentLessonOnTheScreen()) {
    markCurrentLessonButton();
  }
});

let startButton = document.querySelector('.card-footer button.button');
startButton.addEventListener('click', () => {
  maximizeWindow();
  toggleScreen();
  lessonScreenProxy.lessonIndex = currentLesson;
  startManageUserInputs();
});

function closeLesson() {
  stopManageUserInputs();
  toggleScreen();
}

function hasPlayerAlreadyTyped() {
  let firstChar = document.querySelector('.keys');
  return firstChar.classList.contains('has-background-success') ||
    firstChar.classList.contains('has-background-danger');
}

let closeButton = document.getElementById('close-button');
closeButton.addEventListener('click', () => {
  unmarkButtons();
  markCurrentLessonButton();
  setLessonNameOnScreen();
  unmaximizeWindow();
  closeLesson();
});

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

lessonPreviousButton.addEventListener('click', () => {
  --lessonScreenProxy.lessonIndex;
  setCurrentLesson(lessonScreenProxy.lessonIndex);
  restartManageUserInputs();
});

lessonNextButton.addEventListener('click', () => {
  ++lessonScreenProxy.lessonIndex;
  setCurrentLesson(lessonScreenProxy.lessonIndex);
  restartManageUserInputs();
});

setElementsToBePressed('keys');

let dot = document.querySelector('.fas.fa-circle.has-text-success');

setFingerIndicator(dot);

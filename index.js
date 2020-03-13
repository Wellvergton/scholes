import {
  startManageUserInputs, stopManageUserInputs,
  setElementsToBePressed, restartManageUserInputs
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

function closeLesson() {
  stopManageUserInputs();
  toggleScreen();
}

let closeButton = document.getElementById('close-button');
closeButton.addEventListener('click', () => {
  unmaximizeWindow();
  closeLesson();
});

setScreens(document.getElementsByClassName('hero'));

let previousButton = document.getElementById('previous-button');
let nextButton = document.getElementById('next-button');

let screenProxyArgs = {
  textId: 'text',
  charsClass: 'keys',
  previousButton: previousButton,
  nextButton: nextButton
}
let screenProxy = lessonScreenProxyBuilder(screenProxyArgs);
screenProxy.lessonIndex = 1;

previousButton.addEventListener('click', () => {
  restartManageUserInputs();
  --screenProxy.lessonIndex;
});

nextButton.addEventListener('click', () => {
  restartManageUserInputs();
  ++screenProxy.lessonIndex;
});

setElementsToBePressed('keys');

let paginationLinks = document.getElementsByClassName('pagination-link');

function removeIsCurrentClassFromOther() {
  for (let link of paginationLinks) {
    if (link.classList.contains('is-current')) {
      link.classList.remove('is-current');
    }
  }
}

function addIsCurrentClass(element) {
  element.classList.add('is-current');
}

let currentLesson = parseInt(document.querySelector('.is-current').innerHTML);
function setCurrentLesson() {
  currentLesson = parseInt(document.querySelector('.is-current').innerHTML);
}

function setLessonNameOnScreen() {
  let element = document.querySelector('.content > p');
  element.innerHTML = keySets[currentLesson].toUpperCase();
}

setLessonNameOnScreen();

[...paginationLinks].forEach(element => {
  element.addEventListener('click', () => {
    removeIsCurrentClassFromOther();
    addIsCurrentClass(event.target);
    setCurrentLesson();
    setLessonNameOnScreen();
  });
});

let paginationPreviousButton = document.querySelector('.pagination-previous');
let paginationNextButton = document.querySelector('.pagination-next');

let homeScreenProxyArgs = {
  previousButton: paginationPreviousButton,
  nextButton: paginationNextButton
};
let homeScreenProxy = homeScreenProxyBuilder(homeScreenProxyArgs);
homeScreenProxy.currentLowestLink = 1;

function decreasePaginationLinks() {
  if (parseInt(paginationLinks[0].innerHTML) >= 4) {
    for (const link of paginationLinks) {
      let value = parseInt(link.innerHTML);
      link.innerHTML = value - 3;
    }
  }
}

paginationPreviousButton.addEventListener('click', () => {
  decreasePaginationLinks();
  setCurrentLesson();
  setLessonNameOnScreen();
  homeScreenProxy.currentLowestLink = parseInt(paginationLinks[0].innerHTML);
});

function increasePaginationLinks() {
  if (parseInt(paginationLinks[2].innerHTML) <= 9) {
    for (let link of paginationLinks) {
      let value = parseInt(link.innerHTML);
      link.innerHTML = value + 3;
    }
  }
}

paginationNextButton.addEventListener('click', () => {
  increasePaginationLinks();
  setCurrentLesson();
  setLessonNameOnScreen();
  homeScreenProxy.currentLowestLink = parseInt(paginationLinks[0].innerHTML);
});

let startButton = document.querySelector('button.button');
startButton.addEventListener('click', () => {
  maximizeWindow();
  toggleScreen();
  screenProxy.lessonIndex = currentLesson;
  startManageUserInputs();
});

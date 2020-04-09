import homeScreenManager from "./app_modules/homeScreenManager.js";
import keyPressManager from "./app_modules/keyPressManager.js";
import lessonScreenManager from "./app_modules/lessonScreenManager.js";
import recordsManager from "./app_modules/recordsManager.js";
import timer from "./app_modules/timer.js";

const HomeScreen = homeScreenManager({
  homeScreenElement: document.getElementById("home-screen"),
  lessonsIndexesElements: document.getElementsByClassName("pagination-link"),
  lessonNameElement: document.getElementById("lesson-name"),
  nextLessonsButton: document.querySelector(".pagination-next"),
  previousLessonsButton: document.querySelector(".pagination-previous"),
});

let previousLessonButton = document.getElementById("previous-button");
let nextLessonButton = document.getElementById("next-button");

const LessonScreen = lessonScreenManager({
  lessonScreenElement: document.getElementById("lesson-screen"),
  textElement: document.getElementById("text"),
  previousLessonButton: previousLessonButton,
  nextLessonButton: nextLessonButton,
});

document.addEventListener("keypress", (event) => {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
  }
});

document.addEventListener("focusin", (event) => {
  if (event.target.tagName === "BUTTON") {
    event.target.blur();
  }
});

let errorCounter = document.getElementById("error-counter");

const KeyPressManager = keyPressManager({
  keysToBeTyped: document.getElementsByClassName("keys"),
  fingerIndicator: document.getElementById("dot"),
  errorCounter: errorCounter,
});

let timerElement = document.getElementById("timer");

const Timer = timer(timerElement);

const Records = recordsManager({
  timer: timerElement,
  errorCounter: errorCounter,
});

KeyPressManager.on("start", Timer.startTimer);
KeyPressManager.on("stop", [Timer.stopTimer, Records.save]);

let aboutModal = document.querySelector(".modal");

function toggleAboutModal() {
  aboutModal.classList.toggle("is-active");
}

let aboutButton = document.querySelector(".navbar-item > .button.is-info");

aboutButton.addEventListener("click", toggleAboutModal);

aboutModal.addEventListener("click", (event) => {
  let classList = event.target.classList;

  if (classList.contains("delete") || classList.contains("modal-background")) {
    toggleAboutModal();
  } else if (event.target.tagName === "A") {
    event.preventDefault();
    openLinkInOSBrowser(event.target.href);
  }
});

HomeScreen.build(1);

let lessonSelector = document.getElementById("lesson-selector");

lessonSelector.addEventListener("click", (event) => {
  let classList = event.target.classList;

  if (classList.contains("pagination-link")) {
    HomeScreen.selectLesson(event.target.innerHTML);
  } else if (classList.contains("pagination-previous")) {
    HomeScreen.previousLessons();
  } else if (classList.contains("pagination-next")) {
    HomeScreen.nextLessons();
  }
});

let startButton = document.getElementById("start-button");
let leftHand = document.getElementById("left-hand");
let rightHand = document.getElementById("right-hand");

startButton.addEventListener("click", async () => {
  HomeScreen.destroy();
  await maximizeWindow();
  LessonScreen.build(HomeScreen.getSelectedLesson());
  KeyPressManager.setHandsPosition(leftHand, rightHand);
  KeyPressManager.startManageUserInputs();
});

let closeLessonButton = document.getElementById("close-button");

closeLessonButton.addEventListener("click", () => {
  LessonScreen.destroy();
  unmaximizeWindow();
  HomeScreen.build(LessonScreen.getCurrentLesson());
  KeyPressManager.stopManageUserInputs();
  Timer.clearScreenTimer();
});

function hasPlayerAlreadyTyped() {
  let firstChar = document.querySelector(".keys");
  return (
    firstChar.classList.contains("has-background-success") ||
    firstChar.classList.contains("has-background-danger")
  );
}

let lessonNavBar = document.getElementById("lesson-nav-bar");

lessonNavBar.addEventListener("mouseover", (event) => {
  if (event.target.tagName === "BUTTON" && hasPlayerAlreadyTyped()) {
    event.target.classList.add("is-danger");
  }
});

["mouseout", "click"].forEach((evt) => {
  lessonNavBar.addEventListener(evt, (event) => {
    if (event.target.tagName === "BUTTON") {
      event.target.classList.remove("is-danger");
    }
  });
});

previousLessonButton.addEventListener("click", () => {
  LessonScreen.previousLesson();
  Timer.clearScreenTimer();
  errorCounter.innerHTML = "0";
  KeyPressManager.startManageUserInputs();
});

nextLessonButton.addEventListener("click", () => {
  LessonScreen.nextLesson();
  Timer.clearScreenTimer();
  errorCounter.innerHTML = "0";
  KeyPressManager.startManageUserInputs();
});

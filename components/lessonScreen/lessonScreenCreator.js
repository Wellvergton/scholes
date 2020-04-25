import createKeyPressManager from "./keyPressManagerCreator.js";
import createRecordsManager from "./recordsManagerCreator.js";
import createRestultModal from "./resultModalCreator.js";
import createTextBuilder from "./textBuilderCreator.js";
import createTimer from "./timerCreator.js";

export default function createLessonScreen() {
  const KeyPressManager = createKeyPressManager();

  const elements = {
    main: document.querySelector("[data-lesson-screen]"),
    navBar: document.querySelector("[data-lesson-nav-bar]"),
    closeLessonButton: document.querySelector("[data-close-lesson]"),
    previousLessonButton: document.querySelector("[data-previous-lesson]"),
    nextLessonButton: document.querySelector("[data-next-lesson]"),
    text: document.querySelector("[data-text]"),
    leftHand: document.querySelector("[data-left-hand]"),
    rightHand: document.querySelector("[data-right-hand]"),
    errorCounter: document.querySelector("[data-error-counter]"),
    timer: document.querySelector("[data-timer]"),
  };
  const TextBuilder = createTextBuilder(elements.text);
  const Timer = createTimer(elements.timer);

  KeyPressManager.on("start", Timer.startTimer);
  KeyPressManager.on("stop", Timer.stopTimer);

  const properties = { currentLesson: 1 };
  const lessons = {
    1: "qwert",
    2: "yuiop",
    3: "asdfg",
    4: "hjklç",
    5: "zxcvb",
    6: "nm,.;",
    7: "qwertasdfgzxcvb",
    8: "yuiophjklçnm,.;",
    9: "qwertyuiop",
    10: "asdfghjklç",
    11: "zxcvbnm,.;",
    12: "qwertyuiopasdfghjklçzxcvbnm,.;",
  };

  function disableButton(button) {
    button.setAttribute("disabled", "disabled");
  }

  function enableButton(button) {
    button.removeAttribute("disabled");
  }

  const state = new Proxy(properties, {
    set: (target, prop, value) => {
      if (prop === "currentLesson") {
        target[prop] = value;

        if (value === 1) {
          disableButton(elements.previousLessonButton);
          enableButton(elements.nextLessonButton);
        } else if (value === 12) {
          disableButton(elements.nextLessonButton);
          enableButton(elements.previousLessonButton);
        } else {
          enableButton(elements.nextLessonButton);
          enableButton(elements.previousLessonButton);
        }
      }

      return true;
    },
  });
  const LessonScreenObservable = {
    observers: [],
    subscribe: function (observer) {
      this.observers.push(observer);
    },
    notify: function () {
      for (let observer of this.observers) {
        observer(state.currentLesson);
      }
    },
  };

  function subscribe(callback) {
    LessonScreenObservable.subscribe(callback);
  }

  function clearStats() {
    Timer.clearScreenTimer();
    elements.errorCounter.innerHTML = "0";
  }

  function nextLesson() {
    if (state.currentLesson < 12) {
      ++state.currentLesson;
      TextBuilder.build(lessons[state.currentLesson]);
      clearStats();
      KeyPressManager.startManageUserInputs();
    }
  }

  function previousLesson() {
    if (state.currentLesson > 1) {
      --state.currentLesson;
      TextBuilder.build(lessons[state.currentLesson]);
      clearStats();
      KeyPressManager.startManageUserInputs();
    }
  }

  function restartLesson() {
    state.currentLesson = state.currentLesson;
    TextBuilder.build(lessons[state.currentLesson]);
    Timer.clearScreenTimer();
    KeyPressManager.startManageUserInputs();
  }

  function hasPlayerAlreadyTyped() {
    let firstChar = document.querySelector(".keys");
    return (
      firstChar.classList.contains("has-background-success") ||
      firstChar.classList.contains("has-background-danger")
    );
  }

  function build() {
    maximizeWindow();
    TextBuilder.build(lessons[state.currentLesson]);
    elements.main.classList.remove("is-hidden");
    setTimeout(() => {
      KeyPressManager.setHandsPosition(elements.leftHand, elements.rightHand);
      KeyPressManager.startManageUserInputs();
    }, 100);
  }

  function destroy() {
    elements.main.classList.add("is-hidden");
    LessonScreenObservable.notify();
  }

  function selectLesson(lessonNumber) {
    state.currentLesson = lessonNumber;
    TextBuilder.build(lessons[state.currentLesson]);
    clearStats();
    KeyPressManager.startManageUserInputs();
  }

  elements.closeLessonButton.addEventListener("click", () => {
    destroy();
  });
  elements.previousLessonButton.addEventListener("click", previousLesson);
  elements.nextLessonButton.addEventListener("click", nextLesson);
  elements.navBar.addEventListener("mouseover", (event) => {
    if (event.target.tagName === "BUTTON" && hasPlayerAlreadyTyped()) {
      event.target.classList.add("is-danger");
    }
  });
  ["mouseout", "click"].forEach((evt) => {
    elements.navBar.addEventListener(evt, (event) => {
      if (event.target.tagName === "BUTTON") {
        event.target.classList.remove("is-danger");
      }
    });
  });

  const RecordsManager = createRecordsManager({
    timer: elements.timer,
    errorCounter: elements.errorCounter,
  });

  function saveRecords() {
    RecordsManager.save(state.currentLesson);
  }

  const ResultModal = createRestultModal(nextLesson, restartLesson, destroy);

  function showResults() {
    ResultModal.build(
      RecordsManager.getLessonCurrentStats(),
      RecordsManager.getLessonPreviousStats(state.currentLesson),
      state.currentLesson === 12 ? false : true
    );
  }

  KeyPressManager.on("stop", showResults);
  KeyPressManager.on("stop", saveRecords);

  return { build, destroy, selectLesson, subscribe };
}

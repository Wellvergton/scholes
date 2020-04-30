import createAboutModal from "./aboutModalCreator.js";

export default function createHomeScreen() {
  const Modal = createAboutModal();
  const properties = { selectedLesson: 1, lessonIndexPage: 1 };
  const elements = {
    main: document.querySelector("[data-home-screen]"),
    aboutButton: document.querySelector("[data-about-button]"),
    indexes: document.querySelectorAll("[data-index]"),
    lessonName: document.querySelector("[data-lesson-name]"),
    previousLessonsButton: document.querySelector("[data-previous-lessons]"),
    nextLessonsButton: document.querySelector("[data-next-lessons]"),
    lessonSelector: document.querySelector("[data-lesson-selector]"),
    startButton: document.querySelector("[data-start-button]"),
  };
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
  const state = new Proxy(properties, {
    set: (target, prop, value) => {
      if (prop === "selectedLesson") {
        target[prop] = value;
        state.lessonIndexPage = Math.ceil(value / 3);
        unmarkLessonSelectedButtons();
        markLessonSelectedButton();
        setLessonNameOnScreen();
      }
      if (prop === "lessonIndexPage") {
        unmarkLessonSelectedButtons();

        if (value === 1) {
          disableButton(elements.previousLessonsButton);
          enableButton(elements.nextLessonsButton);
        } else if (value === 4) {
          disableButton(elements.nextLessonsButton);
          enableButton(elements.previousLessonsButton);
        } else {
          enableButton(elements.previousLessonsButton);
          enableButton(elements.nextLessonsButton);
        }

        if (value < target[prop]) {
          for (let i = 0; i < target[prop] - value; i++) {
            decreaseIndexesBy3();
          }
        } else if (value > target[prop]) {
          for (let i = 0; i < value - target[prop]; i++) {
            increaseIndexesBy3();
          }
        }

        if (isCurrentLessonOnTheScreen()) {
          markLessonSelectedButton();
        }
        target[prop] = value;
      }

      return true;
    },
  });
  const HomeScreenObservable = {
    observers: [],
    subscribe: function (observer) {
      this.observers.push(observer);
    },
    notify: function () {
      for (let observer of this.observers) {
        observer(state.selectedLesson);
      }
    },
  };

  function subscribe(callback) {
    HomeScreenObservable.subscribe(callback);
  }

  function markLessonSelectedButton() {
    for (let index of elements.indexes) {
      if (parseInt(index.innerHTML) === state.selectedLesson) {
        index.classList.add("is-current");
      }
    }
  }

  function unmarkLessonSelectedButtons() {
    for (let index of elements.indexes) {
      if (index.classList.contains("is-current")) {
        index.classList.remove("is-current");
      }
    }
  }

  function setLessonNameOnScreen() {
    elements.lessonName.innerHTML = lessons[state.selectedLesson].toUpperCase();
  }

  function isCurrentLessonOnTheScreen() {
    return [...elements.indexes].some((index) => {
      return parseInt(index.innerHTML) === state.selectedLesson;
    });
  }

  function increaseIndexesBy3() {
    for (let index of elements.indexes) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value + 3;
    }
  }

  function decreaseIndexesBy3() {
    for (let index of elements.indexes) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value - 3;
    }
  }

  function disableButton(button) {
    button.setAttribute("disabled", "disabled");
  }

  function enableButton(button) {
    button.removeAttribute("disabled");
  }

  function previousLessons() {
    if (state.lessonIndexPage >= 2) {
      --state.lessonIndexPage;
    }
  }

  function nextLessons() {
    if (state.lessonIndexPage <= 3) {
      ++state.lessonIndexPage;
    }
  }

  function selectLesson(number) {
    state.selectedLesson = parseInt(number);
  }

  function build() {
    preload.unmaximizeWindow();
    elements.main.classList.remove("is-hidden");
  }

  function destroy() {
    elements.main.classList.add("is-hidden");
    HomeScreenObservable.notify();
  }

  elements.aboutButton.addEventListener("click", Modal.toggleModal);
  elements.lessonSelector.addEventListener("click", (event) => {
    let classList = event.target.classList;

    if (classList.contains("pagination-link")) {
      selectLesson(event.target.innerHTML);
    } else if (classList.contains("pagination-previous")) {
      if (!event.target.hasAttribute("disabled")) {
        for (let index of elements.indexes) {
          index.classList.add("fade");
        }

        previousLessons();
      }
    } else if (classList.contains("pagination-next")) {
      if (!event.target.hasAttribute("disabled")) {
        for (let index of elements.indexes) {
          index.classList.add("fade");
        }

        nextLessons();
      }
    }
  });
  elements.startButton.addEventListener("click", async () => {
    destroy();
  });

  return { selectLesson, build, destroy, subscribe };
}

export default function homeScreenManager({ homeScreenElement,
  lessonsIndexesElements, lessonNameElement, previousLessonsButton,
  nextLessonsButton } = {}) {
  let selectedLesson;
  const lessons = {
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
    12: 'qwertyuiopasdfghjklçzxcvbnm,.;',
  };

  function markLessonSelectedButton() {
    for (let index of lessonsIndexesElements) {
      if (parseInt(index.innerHTML) == selectedLesson) {
        index.classList.add('is-current');
      }
    }
  }

  function unmarkLessonSelectedButtons() {
    for (let index of lessonsIndexesElements) {
      if (index.classList.contains('is-current')) {
        index.classList.remove('is-current');
      }
    }
  }

  function setLessonNameOnScreen() {
    lessonNameElement.innerHTML = lessons[selectedLesson].toUpperCase();
  }

  function isCurrentLessonOnTheScreen() {
    return [...lessonsIndexesElements].some((index) => {
      return index.innerHTML == selectedLesson;
    });
  }

  function increaseIndexesBy3() {
    for (let index of lessonsIndexesElements) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value + 3;
    }
  }

  function decreaseIndexesBy3() {
    for (let index of lessonsIndexesElements) {
      let value = parseInt(index.innerHTML);
      index.innerHTML = value - 3;
    }
  }

  function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
  }

  function enableButton(button) {
    button.removeAttribute('disabled');
  }

  const proxyTarget = { lessonNumber: 1, lessonIndexPage: 1 }
  const proxyHandler = {
    set: (target, prop, value) => {
      if (prop === 'lessonNumber') {
        selectedLesson = value;
        unmarkLessonSelectedButtons();
        markLessonSelectedButton();
        setLessonNameOnScreen();
      }
      if (prop == 'lessonIndexPage') {
        unmarkLessonSelectedButtons();

        if (value === 1) {
          disableButton(previousLessonsButton);
          enableButton(nextLessonsButton);
        } else if (value === 4) {
          disableButton(nextLessonsButton);
          enableButton(previousLessonsButton);
        } else {
          enableButton(previousLessonsButton);
          enableButton(nextLessonsButton);
        }

        if (value < target[prop]) {
          decreaseIndexesBy3();
        } else if (value > target[prop]) {
          increaseIndexesBy3();
        }

        if (isCurrentLessonOnTheScreen()) {
          markLessonSelectedButton();
        }
      }

      target[prop] = value;

      return true;
    }
  }
  const lessonProxy = new Proxy(proxyTarget, proxyHandler);

  function build(number) {
    lessonProxy.lessonNumber = number;
    lessonProxy.lessonIndexPage = Math.ceil(number / 3);
    homeScreenElement.classList.remove('is-hidden');
  }

  function destroy() {
    homeScreenElement.classList.add('is-hidden');
  }

  function selectLesson(number) {
    lessonProxy.lessonNumber = parseInt(number);
  }

  function previousLessons() {
    if (lessonProxy.lessonIndexPage >= 2) {
      --lessonProxy.lessonIndexPage;
    }
  }

  function nextLessons() {
    if (lessonProxy.lessonIndexPage <= 3) {
      ++lessonProxy.lessonIndexPage;
    }
  }

  return { build, destroy, selectLesson, previousLessons, nextLessons }
}

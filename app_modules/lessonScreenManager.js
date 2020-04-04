import textBuilder from './textBuilder.js';

export default function lessonScreenManager({
  lessonScreenElement,
  textElement,
  previousLessonButton,
  nextLessonButton,
} = {}) {
  const TextBuilder = textBuilder(textElement);
  let currentLesson;
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
    12: 'qwertyuiopasdfghjklçzxcvbnm,.;'
  };

  function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
  }

  function enableButton(button) {
    button.removeAttribute('disabled');
  }

  const proxyTarget = { lessonNumber: 1 };
  const proxyHandler = {
    set: (target, prop, value) => {
      if (prop === 'lessonNumber') {
        currentLesson = value;

        if (value === 1) {
          disableButton(previousLessonButton);
          enableButton(nextLessonButton);
        } else if (value === 12) {
          disableButton(nextLessonButton);
          enableButton(previousLessonButton);
        } else {
          enableButton(nextLessonButton);
          enableButton(previousLessonButton);
        }
      }

      target[prop] = value;

      return true;
    }
  }
  const lessonProxy = new Proxy(proxyTarget, proxyHandler);

  function build(number) {
    lessonProxy.lessonNumber = parseInt(number);
    TextBuilder.build(lessons[currentLesson]);
    lessonScreenElement.classList.remove('is-hidden');
  }

  function destroy() {
    lessonScreenElement.classList.add('is-hidden');
    return currentLesson;
  }

  function nextLesson() {
    if (lessonProxy.lessonNumber < 12) {
      ++lessonProxy.lessonNumber;
      TextBuilder.build(lessons[currentLesson]);
    }
  }

  function previousLesson() {
    if (lessonProxy.lessonNumber > 1) {
      --lessonProxy.lessonNumber;
      TextBuilder.build(lessons[currentLesson]);
    }
  }

  return {
    build, destroy, nextLesson, previousLesson
  }
}

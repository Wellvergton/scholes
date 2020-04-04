import textBuilder from './textBuilder.js';

export default function lessonScreenManager({
  lessonScreenElement,
  textElement,
  previousLessonButton,
  nextLessonButton,
} = {}) {
  const TextBuilder = textBuilder(textElement);
  const Properties = { currentLesson: 1 };
  const Lessons = {
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

  const proxyHandler = {
    set: (target, prop, value) => {
      if (prop === 'currentLesson') {
        target[prop] = value;

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

      return true;
    }
  }
  const lessonProxy = new Proxy(Properties, proxyHandler);

  function build(number) {
    lessonProxy.currentLesson = parseInt(number);
    TextBuilder.build(Lessons[Properties.currentLesson]);
    lessonScreenElement.classList.remove('is-hidden');
  }

  function destroy() {
    lessonScreenElement.classList.add('is-hidden');
    return Properties.currentLesson;
  }

  function nextLesson() {
    if (lessonProxy.currentLesson < 12) {
      ++lessonProxy.currentLesson;
      TextBuilder.build(Lessons[Properties.currentLesson]);
    }
  }

  function previousLesson() {
    if (lessonProxy.currentLesson > 1) {
      --lessonProxy.currentLesson;
      TextBuilder.build(Lessons[Properties.currentLesson]);
    }
  }

  return {
    build, destroy, nextLesson, previousLesson
  }
}

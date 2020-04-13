export default function lessonResultModalCreator({
  modalElem,
  lessonErrorsElem,
  lessonKeysPerMinuteElem,
  previousErrorsElem,
  previousKeysPerMinuteElem,
  newRecordMsgElem,
  previousResultElem,
} = {}) {
  let elements = arguments[0];

  function setTextInGreen(element) {
    element.classList.add("has-text-success");
  }

  function setTextInRed(element) {
    element.classList.add("has-text-danger");
  }

  function build(lessonStats, previousStats) {
    modalElem.classList.toggle("is-active");
    lessonErrorsElem.innerHTML = lessonStats.errors;
    lessonKeysPerMinuteElem.innerHTML = lessonStats.keysPerMinute;

    if (previousStats != null && previousStats != undefined) {
      previousResultElem.classList.remove("is-hidden");
      previousErrorsElem.innerHTML = previousStats.errors;
      previousKeysPerMinuteElem.innerHTML = previousStats.keysPerMinute;

      if (
        lessonStats.errors < previousStats.errors &&
        lessonStats.keysPerMinute < previousStats.keysPerMinute
      ) {
        newRecordMsgElem.classList.remove("is-hidden");
      }
      if (lessonStats.errors < previousStats.errors) {
        setTextInGreen(lessonErrorsElem);
      } else if (lessonStats.errors > previousStats.errors) {
        setTextInRed(lessonErrorsElem);
      }
      if (lessonStats.keysPerMinute < previousStats.keysPerMinute) {
        setTextInGreen(lessonKeysPerMinuteElem);
      } else if (lessonStats.keysPerMinute > previousStats.keysPerMinute) {
        setTextInRed(lessonKeysPerMinuteElem);
      }
    }
  }

  function destroy() {
    modalElem.classList.toggle("is-active");
    newRecordMsgElem.classList.add("is-hidden");
    previousResultElem.classList.add("is-hidden");

    for (let elem in elements) {
      elements[elem].innerHTML = "0";
      elements[elem].classList.remove("has-text-success");
      elements[elem].classList.remove("has-text-danger");
    }
  }

  return { build, destroy };
}

export default function lessonResultModalCreator({
  lessonErrorsElem,
  lessonKeysPerMinuteElem,
  previousErrorsElem,
  previousKeysPerMinuteElem,
  newRecordMsgElem,
  previousResultElem,
} = {}) {
  function setTextInGreen(element) {
    element.classList.toggle("has-text-success");
  }

  function setTextInRed(element) {
    element.classList.toggle("has-text-danger");
  }

  function build(modal, lessonStats, previousStats) {
    modal.classList.toggle("is-active");
    lessonErrorsElem.innerHTML = lessonStats.errors;
    lessonKeysPerMinuteElem.innerHTML = lessonStats.keysPerMinute;

    if (previousStats != null && previousStats != undefined) {
      previousErrorsElem.innerHTML = previousStats.errors;
      previousKeysPerMinuteElem.innerHTML = previousStats.keysPerMinute;

      if (
        lessonStats.errors < previousStats.errors &&
        lessonStats.keysPerMinute < previousStats.keysPerMinute
      ) {
        newRecordMsgElem.classList.toggle("is-hidden");
        setTextInGreen(lessonErrorsElem);
        setTextInGreen(lessonKeysPerMinuteElem);
      } else {
        if (lessonStats.errors > previousStats.errors) {
          setTextInRed(lessonErrorsElem);
        }
        if (lessonStats.keysPerMinute > previousStats.keysPerMinute) {
          setTextInRed(lessonKeysPerMinuteElem);
        }
      }
    } else {
      previousResultElem.classList.toggle("is-hidden");
    }
  }

  function destroy() {}

  return { build };
}

export default function createResultModal() {
  const properties = {
    errorsCount: null,
    keysPerMinuteCount: null,
    previousErrorsCount: null,
    previousKeysPerMinuteCount: null,
  };
  const elements = {
    modal: document.querySelector("[data-result-modal]"),
    errorsCount: document.querySelector("[data-errors]"),
    keysPerMinuteCount: document.querySelector("[data-keys-per-minute]"),
    previousResults: document.querySelector("[data-previous-results]"),
    previousErrorsCount: document.querySelector("[data-previous-errors]"),
    previousKeysPerMinuteCount: document.querySelector(
      "[data-previous-keys-per-minute]"
    ),
    newRecordMessage: document.querySelector("[data-new-record-msg]"),
  };

  function setTextInGreen(element) {
    element.classList.add("has-text-success");
  }

  function setTextInRed(element) {
    element.classList.add("has-text-danger");
  }

  const state = new Proxy(properties, {
    set: (target, property, value) => {
      target[property] = value;
      elements[property].innerHTML = value;

      if (!Object.values(target).includes(null)) {
        elements.previousResults.classList.remove("is-hidden");

        if (target.errorsCount < target.previousErrorsCount) {
          setTextInGreen(elements.errorsCount);
        } else if (target.errorsCount > target.previousErrorsCount) {
          setTextInRed(elements.errorsCount);
        }

        if (target.keysPerMinuteCount > target.previousKeysPerMinuteCount) {
          setTextInGreen(elements.keysPerMinuteCount);
        } else if (
          target.keysPerMinuteCount < target.previousKeysPerMinuteCount
        ) {
          setTextInRed(elements.keysPerMinuteCount);
        }

        if (
          target.errorsCount < target.previousErrorsCount &&
          target.keysPerMinuteCount > target.previousKeysPerMinuteCount
        ) {
          elements.newRecordMessage.classList.remove("is-hidden");
        }
      }

      return true;
    },
  });

  function build(lessonStats, previousStats) {
    if (previousStats === undefined) throw "previousStats cannot be undefined";

    state.errorsCount = lessonStats.errors;
    state.keysPerMinuteCount = lessonStats.keysPerMinute;

    if (previousStats != null) {
      state.previousErrorsCount = previousStats.errors;
      state.previousKeysPerMinuteCount = previousStats.keysPerMinute;
    }

    elements.modal.classList.add("is-active");
  }

  function destroy() {
    elements.modal.classList.remove("is-active");
    elements.newRecordMessage.classList.add("is-hidden");

    for (let prop in state) {
      state[prop] = null;
      elements[prop].classList.remove("has-text-success");
      elements[prop].classList.remove("has-text-danger");
    }
  }

  return { build, destroy };
}
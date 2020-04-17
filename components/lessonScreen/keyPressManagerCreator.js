export default function createKeyPressManager() {
  const elements = {
    keysToBeTyped: document.getElementsByClassName("keys"),
    dot: document.querySelector("[data-dot]"),
    errorCounter: document.querySelector("[data-error-counter]"),
  };

  const EventEmitter = {
    events: new Map([
      ["start", []],
      ["stop", []],
    ]),
    listen: function (event, callbacks) {
      let previousEvents = this.events.get(event);
      this.events.set(event, [...previousEvents.concat(callbacks)]);
    },
    emit: function (event) {
      let listeners = this.events.get(event);

      if (listeners.length > 0) {
        listeners.forEach((event) => event());
      }
    },
  };

  function on(event, callback) {
    EventEmitter.listen(event, callback);
  }

  function isTheCorrectKey(keyTyped, expectedKey) {
    if (keyTyped === "Enter" && expectedKey === "\u21B5") {
      return true;
    } else {
      return keyTyped === expectedKey;
    }
  }

  let position = 0;

  function markTypedKey(key, elementToCompare) {
    return new Promise((resolve) => {
      if (isTheCorrectKey(key, elementToCompare.innerHTML)) {
        elementToCompare.classList.add("has-background-success");
      } else {
        elementToCompare.classList.add("has-background-danger");
      }

      resolve();
    });
  }

  let errorCount = 0;
  let handsTop;
  let handsLeft;
  let handsRight;
  let Fingers;

  function indicateTheCorrectFinger(char) {
    for (let finger in Fingers) {
      if (Fingers[finger].chars.includes(char)) {
        elements.dot.style = Fingers[finger].positionOnScreen;
      }
    }
  }

  function restartCounters() {
    position = 0;
    errorCount = 0;
    elements.errorCounter.innerHTML = errorCount;
  }

  function setHandsPosition(left, right) {
    handsTop = left.getBoundingClientRect().top;
    handsLeft = left.getBoundingClientRect().left;
    handsRight = right.getBoundingClientRect().right;
    Fingers = {
      leftPinky: {
        chars: "qaz",
        positionOnScreen: `top: ${handsTop + 34.5}px; left: ${
          handsLeft + 2.125
        }px;`,
      },
      leftRingFinger: {
        chars: "wsx",
        positionOnScreen: `top: ${handsTop + 12.5}px; left: ${
          handsLeft + 24.025
        }px;`,
      },
      leftMiddleFinger: {
        chars: "edc",
        positionOnScreen: `top: ${handsTop + 2.5}px; left: ${
          handsLeft + 46.125
        }px;`,
      },
      leftIndexFinger: {
        chars: "rfvtgb",
        positionOnScreen: `top: ${handsTop + 12.5}px; left: ${
          handsLeft + 68.125
        }px;`,
      },
      leftThumb: {
        chars: " ",
        positionOnScreen: `top: ${handsTop + 66}px; left: ${
          handsLeft + 93.625
        }px;`,
      },
      rightPinky: {
        chars: "pç;\u21B5",
        positionOnScreen: `top: ${handsTop + 34.5}px; right: ${
          handsRight - 1241.625
        }px;`,
      },
      rightRingFinger: {
        chars: "ol.",
        positionOnScreen: `top: ${handsTop + 12.5}px; right: ${
          handsRight - 1219.625
        }px;`,
      },
      rightMiddleFinger: {
        chars: "ik,",
        positionOnScreen: `top: ${handsTop + 2.5}px; right: ${
          handsRight - 1197.625
        }px;`,
      },
      rightIndexFinger: {
        chars: "ujmyhn",
        positionOnScreen: `top: ${handsTop + 12.5}px; right: ${
          handsRight - 1175.425
        }px;`,
      },
    };
  }

  function startManageUserInputs() {
    indicateTheCorrectFinger(elements.keysToBeTyped[0].innerHTML);
    restartCounters(elements.errorCounter);
    document.addEventListener("keypress", manageUserInput);
  }

  function stopManageUserInputs() {
    document.removeEventListener("keypress", manageUserInput);
    EventEmitter.emit("stop");
  }

  async function manageUserInput(keypress) {
    if (position === 0) {
      EventEmitter.emit("start");
    }

    await markTypedKey(keypress.key, elements.keysToBeTyped[position]);

    if (
      !isTheCorrectKey(keypress.key, elements.keysToBeTyped[position].innerHTML)
    ) {
      errorCount++;
      elements.errorCounter.innerHTML = errorCount;
    }

    position++;

    if (position === elements.keysToBeTyped.length) {
      stopManageUserInputs();
      return;
    }

    indicateTheCorrectFinger(elements.keysToBeTyped[position].innerHTML);
  }

  return { startManageUserInputs, stopManageUserInputs, setHandsPosition, on };
}

export default function keyPressManager({ keysToBeTyped, fingerIndicator,
  errorCounter } = {}) {

  const EventEmitter = {
    events: new Map([['start', []], ['stop', []]]),
    listen: function(event, callback) {
      let previousEvents = this.events.get(event);
      this.events.set(event, [...previousEvents.concat(callback)]);
    },
    emit: function(event) {
      let listeners = this.events.get(event);

      if (listeners.length > 0) {
        listeners.forEach((event) => event());
      }
    },
  }

  function on(event, callback) {
    EventEmitter.listen(event, callback);
  }

  function isTheCorrectKey(keyTyped, expectedKey) {
    if (keyTyped == 'Enter' && expectedKey == '\u21B5') {
      return true;
    } else {
      return keyTyped == expectedKey;
    }
  }

  let position = 0;

  function markTypedKey(key) {
    let elementToCompare = keysToBeTyped[position];

    return new Promise((resolve) => {
      if (isTheCorrectKey(key, elementToCompare.innerHTML)) {
        elementToCompare.classList.add('has-background-success');
      } else {
        elementToCompare.classList.add('has-background-danger');
      }

      resolve();
    });
  }

  let errorCount = 0;
  let handsTop;
  let handsLeft;
  let handsRight;
  let Fingers;

  function setHandsPosition(left, right) {
    handsTop = left.getBoundingClientRect().top;
    handsLeft = left.getBoundingClientRect().left;
    handsRight = right.getBoundingClientRect().right;
    Fingers = {
      leftPinky: {
        chars: 'qaz',
        positionOnScreen: `top: ${handsTop + 34.5}px; left: ${handsLeft + 2.125}px;`,
      },
      leftRingFinger: {
        chars: 'wsx',
        positionOnScreen: `top: ${handsTop + 12.5}px; left: ${handsLeft + 24.025}px;`,
      },
      leftMiddleFinger: {
        chars: 'edc',
        positionOnScreen: `top: ${handsTop + 2.5}px; left: ${handsLeft + 46.125}px;`,
      },
      leftIndexFinger: {
        chars: 'rfvtgb',
        positionOnScreen: `top: ${handsTop + 12.5}px; left: ${handsLeft + 68.125}px;`,
      },
      leftThumb: {
        chars: ' ',
        positionOnScreen: `top: ${handsTop + 66}px; left: ${handsLeft + 93.625}px;`,
      },
      rightPinky: {
        chars: 'pç;\u21B5',
        positionOnScreen: `top: ${handsTop + 34.5}px; right: ${handsRight - 1241.625}px;`,
      },
      rightRingFinger: {
        chars: 'ol.',
        positionOnScreen: `top: ${handsTop + 12.5}px; right: ${handsRight - 1219.625}px;`,
      },
      rightMiddleFinger: {
        chars: 'ik,',
        positionOnScreen: `top: ${handsTop + 2.5}px; right: ${handsRight - 1197.625}px;`,
      },
      rightIndexFinger: {
        chars: 'ujmyhn',
        positionOnScreen: `top: ${handsTop + 12.5}px; right: ${handsRight - 1175.425}px;`,
      },
    }
  }

  function indicateTheCorrectFinger(char) {
    for (let finger in Fingers) {
      if (Fingers[finger].chars.includes(char)) {
        fingerIndicator.style = Fingers[finger].positionOnScreen;
      }
    }
  }

  function restartCounters() {
    position = 0;
    errorCount = 0;
    errorCounter.innerHTML = errorCount;
  }

  function startManageUserInputs() {
    indicateTheCorrectFinger(keysToBeTyped[0].innerHTML);
    restartCounters();
    document.addEventListener('keypress', manageUserInput);
  }

  function stopManageUserInputs() {
    document.removeEventListener('keypress', manageUserInput);
  }

  async function manageUserInput(keypress) {
    EventEmitter.emit('start');
    await markTypedKey(keypress.key);
    if (!isTheCorrectKey(keypress.key, keysToBeTyped[position].innerHTML)) {
      errorCount++;
      errorCounter.innerHTML = errorCount;
    }

    position++;

    if (position == keysToBeTyped.length) {
      EventEmitter.emit('stop');
      stopManageUserInputs();

      return;
    }

    indicateTheCorrectFinger(keysToBeTyped[position].innerHTML);
  }

  return { startManageUserInputs, stopManageUserInputs, setHandsPosition, on }
}

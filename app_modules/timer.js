export { setTimerElement, startTimer, stopTimer, clearScreenTimer }

let minutes = 0;
let seconds = 0;

function increaseTime() {
  if (seconds == 59) {
    minutes++;
    seconds = 0;
  } else {
    seconds++;
  }
}

function clearTimer() {
  minutes = 0;
  seconds = 0;
}

function checkTime(number) {
  if (number < 10) {
    number = '0' + number;
  }

  return number;
}

let timerElement;

function setTimerElement(element) {
  timerElement = element;
}

function setScreenTimer() {
  timerElement.innerHTML = `${checkTime(minutes)}:${checkTime(seconds)}`;
}

function adjustTimer() {
  increaseTime();
  setScreenTimer();
}

let intervalFunction = false;

function startTimer() {
  if (intervalFunction == false) {
    intervalFunction = setInterval(adjustTimer, 1000);
  }
}

function stopTimer() {
  clearInterval(intervalFunction);
  clearTimer();
  intervalFunction = false;
}

function clearScreenTimer() {
  stopTimer();
  setScreenTimer();
}

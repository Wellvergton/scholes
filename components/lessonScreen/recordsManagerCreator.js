export default function createRecordsManager({ timer, errorCounter } = {}) {
  function timeInSeconds(time) {
    let fields = time.split(":");
    let seconds = (parseInt(fields[0]) * 60) + parseInt(fields[1]);

    return seconds;
  }

  function keysPerMinute(finalTimeInSeconds) {
    if (finalTimeInSeconds === 0) return 0;

    let totalOfkeys = 720;
    let keysPerMinute = (totalOfkeys / finalTimeInSeconds) * 60;

    return keysPerMinute;
  }

  function getLessonCurrentStats() {
    let currentLessonStats = {};
    let finalTime = timeInSeconds(timer.innerHTML);
    currentLessonStats.errors = parseInt(errorCounter.innerHTML);
    currentLessonStats.keysPerMinute = keysPerMinute(finalTime);

    return currentLessonStats;
  }

  function getLessonPreviousStats(lessonNumber) {
    let records = getRecords();

    if (records[`lesson${lessonNumber}`]) {
      let lessonPreviousStats = records[`lesson${lessonNumber}`];

      return lessonPreviousStats;
    } else {
      return null;
    }
  }

  function save(lessonIndex) {
    let records = getRecords();
    let previousStats = getLessonPreviousStats();
    let currentStats = getLessonCurrentStats();
    let lesson = `lesson${lessonIndex}`;

    if (currentStats.keysPerMinute < 850) {
      if (previousStats === null) {
        records[lesson] = currentStats;
      } else {
        if (currentStats.errors < previousStats.errors) {
          records[lesson].errors = currentStats.errors;
        }
        if (currentStats.keysPerMinute < previousStats.keysPerMinute) {
          records[lesson].keysPerMinute = currentStats.keysPerMinute;
        }
      }

      saveRecords(records);
    }
  }

  return { save, getLessonCurrentStats, getLessonPreviousStats };
}

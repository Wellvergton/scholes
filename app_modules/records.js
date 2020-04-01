export default function recordsManager({ timer, errorCounter } = {}) {

  function timeInSeconds(time) {
    let fields = time.split(':');
    let seconds = (parseInt(fields[0]) * 60) + parseInt(fields[1]);

    return seconds;
  }

  function keysPerMinute(finalTimeInSeconds) {
    let totalOfkeys = 720;
    let keysPerMinute = (totalOfkeys / finalTimeInSeconds) * 60;

    return parseInt(keysPerMinute);
  }

  function save(lessonIndex) {
    let records = getRecords();
    let stats = {};
    let lesson = `lesson${lessonIndex}`;
    let finalTime = timeInSeconds(timer.innerHTML);
    stats.errors = parseInt(errorCounter.innerHTML);
    stats.keysPerMinute = keysPerMinute(finalTime);

    if (stats.keysPerMinute < 850) {
      if (!records[lesson]) {
        records[lesson] = stats;
      }
      if (stats.errors < records[lesson].errors) {
        records[lesson].errors = stats.errors;
      }
      if (stats.keysPerMinute < records[lesson].keysPerMinute) {
        records[lesson].keysPerMinute = stats.keysPerMinute;
      }

      saveRecords(records);
    }
  }

  return { save };
}

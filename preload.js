const { ipcRenderer, shell } = require("electron");

window.unmaximizeWindow = function () {
  ipcRenderer.send("unmaximize-window");
};

window.maximizeWindow = function () {
  ipcRenderer.send("maximize-window");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

window.openLinkInOSBrowser = function (link) {
  shell.openExternal(link);
};

window.getRecords = function () {
  let records = ipcRenderer.sendSync("get-records");

  return records;
};

window.saveRecords = function (records) {
  ipcRenderer.send("save-records", records);
};

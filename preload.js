const { ipcRenderer, shell } = require("electron");

window.preload = {
  unmaximizeWindow: function () {
    ipcRenderer.send("unmaximize-window");
  },

  maximizeWindow: function () {
    ipcRenderer.send("maximize-window");
  },

  openLinkInOSBrowser: function (link) {
    shell.openExternal(link);
  },

  getRecords: function () {
    let records = ipcRenderer.sendSync("get-records");

    return records;
  },

  saveRecords: function (records) {
    ipcRenderer.send("save-records", records);
  },
};

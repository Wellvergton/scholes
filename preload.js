const { ipcRenderer, shell } = require('electron');

window.unmaximizeWindow = function() {
  ipcRenderer.send('unmaximize-window');
}

window.maximizeWindow = function() {
  ipcRenderer.send('maximize-window');
}

window.openLinkInOSBrowser = function(link) {
  shell.openExternal(link);
}

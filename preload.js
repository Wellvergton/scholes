const { ipcRenderer } = require('electron');

window.unmaximizeWindow = function() {
  ipcRenderer.send('unmaximize-window');
}

window.maximizeWindow = function() {
  ipcRenderer.send('maximize-window');
}

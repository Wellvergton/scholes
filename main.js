const { app, BrowserWindow } = require('electron');

const path = require('path');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 650,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, "preload.js") }
  });
  win.loadFile('index.html');
  win.on('closed', () => win = null);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit;
  }
});
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

const { ipcMain } = require('electron');
ipcMain.on('maximize-window', () => {
  win.resizable = true;
  win.maximize();
  win.resizable = false;
});
ipcMain.on('unmaximize-window', () => {
  win.unmaximize();
  win.setSize(550, 650);
});

const { BrowserWindow, app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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

let userConfigPath = app.getPath('userData');
let recordsFile = `${userConfigPath}/User Data/records.json`;

if (!fs.existsSync(recordsFile)) {
  fs.writeFileSync(recordsFile, '');
}

ipcMain.on('get-records', (event) => {
  let recordsFileData = fs.readFileSync(recordsFile, 'utf8', (err) => {
    if (err) throw err;
  });

  result = recordsFileData ? recordsFileData : '{}';

  event.returnValue = JSON.parse(result);
});
ipcMain.on('save-records', (event, object) => {
  let json = JSON.stringify(object);

  fs.writeFileSync(recordsFile, json);
});
ipcMain.on('maximize-window', () => {
  win.resizable = true;
  win.maximize();
  win.resizable = false;
});
ipcMain.on('unmaximize-window', () => {
  win.unmaximize();
  win.setSize(550, 650);
});

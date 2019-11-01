const path = require('path');
const url = require('url');

const electron = require('electron');
const isEmpty = require('lodash/isEmpty');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    frame: true,
    width: 368,
    height: 600,
    resizable: false,
    webPreferences: { nodeIntegration: true, webSecurity: false },
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/build/index.html'),
      protocol: 'file:',
      slashes: true,
    });

  mainWindow.loadURL(startUrl);

  !isEmpty(process.env.ELECTRON_START_URL) &&
    mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

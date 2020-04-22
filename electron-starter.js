const path = require('path');
const url = require('url');

const { app, BrowserWindow, Menu } = require('electron');
const isEmpty = require('lodash/isEmpty');

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

(async () => {
  await app.whenReady();

  Menu.setApplicationMenu(Menu.buildFromTemplate([]));

  createWindow();
})();

'use strict';
process.env.ELECTRON_HIDE_INTERNAL_MODULES = 'true';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const temp = require('temp');
const fs = require('fs');

var mainWindow = null;

temp.track();

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

var startupOpts = {
    useContentSize: true,
    width: 800,
    height: 600,
    center: true,
    resizable: false,
    alwaysOnTop: false,
    fullscreen: false,
    skipTaskbar: true,
    kiosk: false,
    title: '',
    icon: null,
    show: false,
    frame: true,
    disableAutoHideCursor: false,
    autoHideMenuBar: false,
    titleBarStyle: 'default'
};

app.on('ready', function() {
    mainWindow = new BrowserWindow(startupOpts);

    if (process.env.NODE_ENV === 'dev') {
      mainWindow.webContents.on('did-start-loading', function() {
        mainWindow.webContents.executeJavaScript('var script = document.createElement(\'script\');script.type = \'text/javascript\';script.src=\'http://localhost:35729/livereload.js\';document.body.appendChild(script);');
      });
      //mainWindow.openDevTools();
    }
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    mainWindow.show();
});

const sendRubyOutput = (output) => {
  console.log(output);
  mainWindow.webContents.send('ran-ruby', output);
};

const runRuby = (input) => {
  let exec = require("child_process").exec;

  temp.open('rubyrepl', function(err, tempFile) {
    if (!err) {
      fs.write(tempFile.fd, input);
      fs.close(tempFile.fd, function(err) {
        console.log(tempFile.path);
        exec(`ruby ${tempFile.path}`, function (err, stdout, stderr) {
          sendRubyOutput(stdout);
        });
      });
    }
  });
};

exports.runRuby = runRuby;

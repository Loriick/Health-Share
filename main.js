const electron = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");
var isMac = process.platform === "darwin";
var chokidar = require("chokidar");

const { app, BrowserWindow, ipcMain } = electron;

//windows
let mainWindow;
let watcher;
const config = {
  height: 900,
  width: 1400,
  show: false,
  webPreferences: {
    nodeIntegration: true
  }
};

const chokidarConfig = {
  ignored: /[\/\\]\./,
  persistent: true,
  ignoreInitial: true
};

function createWindow() {
  mainWindow = new BrowserWindow(config);
  mainWindow.loadFile(__dirname + "/index.html");

  mainWindow.on("ready-to-show", function() {
    watcher = chokidar.watch(
      require("os").homedir() + "/FHIR/*.pdf",
      chokidarConfig
    );
    mainWindow.show();
    watcher
      .on("add", (path, stats) => {
        console.log(path);
        let date = new Date();
        mainWindow.webContents.send("added", { path, date });
      })
      .on("error", function(error) {
        console.log("Error happened", error);
      });
  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("close", () => app.quit());

// fs.watch(
//   require("os").homedir() + "/FHIR",
//   { encoding: "utf-8" },
//   (eventType, filename) => {
//     console.log(filename, eventType);
//     // Prints: <Buffer ...>
//   }
// );

function StartWatcher(path) {
  function onWatcherReady() {
    console.info(
      "From here can you check for real changes, the initial scan has been completed."
    );
  }

  // Declare the listeners of the watcher

  //.on("ready", onWatcherReady);
}

const electron = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");
var fileWatcher = require("chokidar");
var isMac = process.platform === "darwin";
console.log(require("os").homedir());

const { app, BrowserWindow, Menu, ipcMain, Notification } = electron;

//windows
let mainWindow;
const pathFolder = "./src/upload";
const root = "../../../../../FHIR";

const config = {
  height: 900,
  width: 1400
};

const chokidarConfig = {
  ignored: /[\/\\]\./,
  persistent: true,
  ignoreInitial: false
};
const createWindow = () => {
  mainWindow = new BrowserWindow(config);
  mainWindow.loadURL("http://localhost:1234");

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
};

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
  var chokidar = require("chokidar");

  var watcher = chokidar.watch(path, chokidarConfig);

  function onWatcherReady() {
    console.info(
      "From here can you check for real changes, the initial scan has been completed."
    );
  }

  // Declare the listeners of the watcher
  watcher
    .on("add", function(path, stats) {
      console.log(arguments);
    })
    .on("change", function(path) {
      console.log("File", path, "has been changed");
    })
    .on("error", function(error) {
      console.log("Error happened", error);
    })
    .on("ready", onWatcherReady)
    .on("raw", function(event, path, details) {
      // This event should be triggered everytime something happens.
      console.log("Raw event info:", event, path, details);
    });
}
StartWatcher(require("os").homedir() + "/FHIR/*.pdf");

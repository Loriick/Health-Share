const electron = require("electron");
const chokidar = require("chokidar");
const fs = require("fs");
const { app, BrowserWindow, TouchBar } = electron;
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

let mainWindow;
let watcher;

//windows configuration
const windowConfig = {
  height: 900,
  width: 1400,
  show: false,
  webPreferences: {
    nodeIntegration: true
  }
};

//watcher configuration
const chokidarConfig = {
  ignored: /[\/\\]\./,
  persistent: true,
  ignoreInitial: true
};

const openDirBtn = new TouchBarLabel({
  label: "Health Share 📂🥼"
});

const touchBar = new TouchBar([
  openDirBtn,
  new TouchBarSpacer({ size: "large" })
]);

function createWindow() {
  mainWindow = new BrowserWindow(windowConfig);
  mainWindow.loadFile(__dirname + "/index.html");

  //watch only .pdf type added on the "FHIR" directory
  mainWindow.on("ready-to-show", function() {
    watcher = chokidar.watch(
      //get path from ~
      require("os").homedir() + "/FHIR/*.pdf",
      chokidarConfig
    );
    mainWindow.show();
    watcher
      .on("add", (pathFile, { size }) => {
        let date = new Date();
        //send information to my renderer.js on if my file is less or egual than 2Mo
        if (size <= 2000) {
          mainWindow.webContents.send("added", { pathFile, date });
        }
      })
      .on("error", function(error) {
        console.log("Error happened", error);
      });
  });

  mainWindow.setTouchBar(touchBar);

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("close", () => app.quit());

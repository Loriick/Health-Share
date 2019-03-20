const moment = require("moment");
const { ipcRenderer } = require("electron");
const path = require("path");
const Storage = require("./storage");
const api = require("./api");

//DOM Element
const $dropZone = document.querySelector(".drop__zone");
const $list = document.querySelector(".drop__table-list");
const $name = document.querySelector(".drop__result-name  span");
const $binary = document.querySelector(".drop__result-binary  span");
const $input = document.querySelector("#file");
const $success = document.querySelector(".drop__success");

//Variables
let lastestFiles = [];
const eventsArray = ["dragenter", "dragover", "dragleave", "drop"];
const storage = new Storage("folder");

//GET DATA FROM MAIN ANYTIME A FOLDER
ipcRenderer.on("added", (event, { pathFile, date }) => {
  const name = path.basename(pathFile);
  let createdAt = moment(date).format("DD/MM/YYYY");

  //create a new file from the data
  const file = new File([pathFile], name, {
    path: pathFile,
    type: "application/pdf"
  });
  renderAfterDrop(name, $name);
  uploadFile(file);
  setLastFile({ name, date: createdAt });
});

/**
 * @event
 *
 */

const handleDrop = e => {
  const file = e.dataTransfer.files[0];
  const { name, type } = file;
  if (type !== "application/pdf") {
    $dropZone.classList.add("drop__danger");
    return;
  }
  $dropZone.classList.remove("drop__danger");
  let date = moment(new Date()).format("DD/MM/YYYY");
  console.log(date);
  renderAfterDrop(name, $name);

  let lastFile = { name, date };
  setLastFile(lastFile);

  uploadFile(file);
};

/**
 * @param {file} file
 *
 */

const uploadFile = file => {
  let formData = new FormData();
  formData.append("file", file);
  api(formData, renderAfterDrop, $success);
};

/**
 * @param {array} array
 *
 */

const displayLastestFiles = array => {
  if (array.length > 0) {
    $list.innerHTML = "";
    return array.map(({ name, date }) => {
      console.log(name);
      return $list.insertAdjacentHTML(
        "beforeend",
        `
        <tr>
          <td>${name}</td>
          <td>${date}</td>
        </tr>
          `
      );
    });
  }
};

/**
 * @param {Object} obj
 *
 */
const setLastFile = obj => {
  lastestFiles.push(obj);
  if (lastestFiles.length > 5) {
    lastestFiles.shift();
  }
  storage.set(lastestFiles);

  displayLastestFiles(lastestFiles);
};

/**
 * @param {String} data
 * @param  {node} DOMElement
 *
 */

const renderAfterDrop = (data, DOMElement = $binary) => {
  DOMElement.textContent = data;
  DOMElement.classList.add("file-upload");
};

const getDatafromStorage = () => {
  let data = storage.get();
  if (data === null) {
    return;
  } else if (data !== null && data.length > 0) lastestFiles = [...data];
  displayLastestFiles(data);
};

eventsArray.forEach(event =>
  $dropZone.addEventListener(event, e => {
    e.stopPropagation();
    e.preventDefault();
  })
);
$dropZone.addEventListener("drop", handleDrop);
window.addEventListener("load", getDatafromStorage);

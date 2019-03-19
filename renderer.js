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

//Variables
let lastestFiles = [];
const eventsArray = ["dragenter", "dragover", "dragleave", "drop"];
const storage = new Storage("folder");

const preventDefaults = e => {
  e.stopPropagation();
  e.preventDefault();
};

//GET DATA FROM MAIN ANYTIME A FOLDER
ipcRenderer.on("added", (event, { pathFile, date }) => {
  const name = path.basename(pathFile);
  let createdAt = moment(date).format("DD/MM/YYYY");

  const file = new File([pathFile], name, {
    path: pathFile,
    type: "application/pdf"
  });
  renderAfterDrop(name, $name);
  uploadFile(file);
  setLastFile({ name, date: createdAt });
});

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

  //uploadFile(file);
};

const uploadFile = async file => {
  let formData = new FormData();
  formData.append("file", file);
  await api(formData, renderAfterDrop);
};

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

const setLastFile = obj => {
  lastestFiles.push(obj);
  if (lastestFiles.length > 5) {
    lastestFiles.shift();
  }
  storage.set(lastestFiles);
  displayLastestFiles(lastestFiles);
};

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
  $dropZone.addEventListener(event, preventDefaults)
);
$dropZone.addEventListener("drop", handleDrop);
window.addEventListener("load", getDatafromStorage);

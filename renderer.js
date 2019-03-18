const moment = require("moment");
const { ipcRenderer } = require("electron");

//DOM Element
const $drop = document.querySelector(".drop");
const $dropZone = document.querySelector(".drop__zone");
const $table = document.querySelector(".drop__history table");
const eventsArray = ["dragenter", "dragover", "dragleave", "drop"];
const $list = document.querySelector(".drop__table-list");
const $name = document.querySelector(".drop__result-name  span");
const lastestFiles = [];

class Storage {
  constructor(key) {
    this.key = key;
  }

  stringify(value) {
    return JSON.stringify(value);
  }

  parseJSON(value) {
    return JSON.parse(value);
  }

  get() {
    return this.parseJSON(window.localStorage.getItem(this.key));
  }

  set(value) {
    const storage = this.get();
    var newStorage = storage !== null ? [...value] : value;
    if (newStorage.length > 5) {
      newStorage.shift();
    }
    window.localStorage.setItem(this.key, this.stringify(newStorage));
  }
}
const storage = new Storage("folder");

const preventDefaults = e => {
  e.stopPropagation();
  e.preventDefault();
};

ipcRenderer.on("added", function(event, props) {
  console.log("listen");
  console.log("props", props);
  console.log("event", event);
});

const handleDrop = e => {
  const file = e.dataTransfer.files[0];
  const { name, type } = file;
  //type:
  if (type !== "application/pdf") {
    $dropZone.classList.add("drop__danger");
    return;
  }
  $dropZone.classList.remove("drop__danger");
  let date = moment(new Date()).format("DD/MM/YYYY");
  console.log(date);
  renderAfterDrop(name);

  let lastFile = { name, date };
  //uploadFile(file);

  setLastFile(lastFile);
};

const uploadFile = async file => {
  let formData = new FormData();
  formData.append("file", file);
  api(formData, renderAfterDrop);
};

const getDatafromStorage = () => {
  let data = storage.get();
  if (data === null) {
    return;
  } else if (data !== null && data.length > 0) lastestFiles = [...data];
  displayLastestFiles(data);
};

const api = async (formData, callback) => {
  try {
    const data = await fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
      method: "POST",
      body: formData
    });
    console.log(data);
    const findTotal = await fetch(
      "http://hapi.fhir.org/baseDstu3/Binary/_history?"
    );
    const findTotalJSON = await findTotal.json();
    const { total } = findTotalJSON;
    console.log(total);
    callback($binary, total);
    // renderAfterDrop($binary, total);
  } catch (error) {
    console.log(err);
  }
};

const renderLastFile = (name, date) => {
  return `
        <tr>
          <td>${name}</td>
          <td>${date}</td>
        </tr>
          `;
};

const displayLastestFiles = array => {
  if (array.length > 0) {
    $list.innerHTML = "";
    return array.map(({ name, date }) => {
      console.log(name);
      return $list.insertAdjacentHTML("beforeend", renderLastFile(name, date));
    });
  }
};

const setLastFile = obj => {
  lastestFiles.push(obj);
  if (lastestFiles.length > 5) {
    lastestFiles.shift();
  }
  console.log(lastestFiles);
  storage.set(lastestFiles);
  displayLastestFiles(lastestFiles);
};

const renderAfterDrop = (data, DOMElement = $name) => {
  DOMElement.textContent = data;
  DOMElement.classList.add("file-upload");
};

eventsArray.forEach(event =>
  $dropZone.addEventListener(event, preventDefaults)
);
$dropZone.addEventListener("drop", handleDrop);
window.addEventListener("load", getDatafromStorage);

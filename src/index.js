import "core-js/shim"; // included < Stage 4 proposals
import "regenerator-runtime/runtime";
import moment from "moment";
import storage from "./helpers/storage";
import "./styles/style.scss";

//DOM Element
const $drop = document.querySelector(".drop");
const $dropZone = document.querySelector(".drop__zone");
const $name = document.querySelector(".drop__result-name  span");
const $binary = document.querySelector(".drop__result-binary > span");
const $table = document.querySelector(".drop__history table");
const $list = document.querySelector(".drop__table-list");
const eventsArray = ["dragenter", "dragover", "dragleave", "drop"];
let lastestFiles = [];

const preventDefaults = e => {
  e.stopPropagation();
  e.preventDefault();
};

const handleDrop = e => {
  const file = e.dataTransfer.files[0];
  const { name, type } = file;
  //uploadFile(file);
  //type:
  if (type !== "application/pdf") {
    $dropZone.classList.add("drop__danger");
    return;
  }
  $dropZone.classList.remove("drop__danger");
  let date = moment(new Date()).format("DD/MM/YYYY");
  console.log(date);
  renderAfterDrop($name, name);
  let lastFile = { name, date };
  setLastFile(lastFile);
};

const setLastFile = obj => {
  lastestFiles.push(obj);
  if (lastestFiles.length > 5) {
    lastestFiles.shift();
  }
  console.log(lastestFiles);
  storage.set(new Set(lastestFiles));
  displayLastestFiles(lastestFiles);
};

const renderAfterDrop = (DOMElement, data) => {
  DOMElement.textContent = data;
  DOMElement.classList.add("file-upload");
};

const uploadFile = async file => {
  let formData = new FormData();
  formData.append("file", file);
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
    renderAfterDrop($binary, total);
  } catch (error) {
    console.log(err);
  }
};

const getDatafromStorage = () => {
  let data = storage.get();
  if (data === null) {
    return;
  } else if (data !== null && data.length > 0) lastestFiles = [...data];
  displayLastestFiles(data);
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

eventsArray.forEach(event =>
  $dropZone.addEventListener(event, preventDefaults)
);
$dropZone.addEventListener("drop", handleDrop);
window.addEventListener("load", getDatafromStorage);

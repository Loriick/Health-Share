import "./styles/style.scss";

//DOM Element
const drop = document.querySelector(".drop");
const dropZone = document.querySelector(".drop__area");
const eventsArray = ["dragenter", "dragover", "dragleave", "drop"];

const preventDefaults = e => {
  e.stopPropagation();
  e.preventDefault();
};

const handleDrop = e => {
  const file = e.dataTransfer.files[0];
  const { name } = file;
  console.log(name);
  drop.insertAdjacentHTML("beforeend", renderAfterDrop(name));
};

const renderAfterDrop = name => `<p>your file name is ${name}</p>`;

eventsArray.forEach(event => dropZone.addEventListener(event, preventDefaults));
dropZone.addEventListener("drop", handleDrop);

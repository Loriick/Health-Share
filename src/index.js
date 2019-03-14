import "core-js/shim"; // included < Stage 4 proposals
import "regenerator-runtime/runtime";
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
  uploadFile(file);
  // drop.insertAdjacentHTML("beforeend", renderAfterDrop(name));
  renderAfterDrop("Your file is: ", name);
};

const renderAfterDrop = (message, data) => {
  return drop.insertAdjacentHTML("beforeend", `<p>${message} ${data}</p>`);
};

const getTotalBinary = binary => binary;

eventsArray.forEach(event => dropZone.addEventListener(event, preventDefaults));
dropZone.addEventListener("drop", handleDrop);

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
    getTotalBinary(total);
    console.log(total);
    renderAfterDrop("Total of Binary", total);
  } catch (error) {
    console.log(err);
  }
};

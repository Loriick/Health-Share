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
  drop.insertAdjacentHTML("beforeend", renderAfterDrop(name));
};

const renderAfterDrop = name => `<p>your file name is ${name}</p>`;

eventsArray.forEach(event => dropZone.addEventListener(event, preventDefaults));
dropZone.addEventListener("drop", handleDrop);

const uploadFile = file => {
  let formData = new FormData();
  formData.append("file", file);

  fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
    method: "POST",
    body: formData
  })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * @param {file} formDatas
 * @callback
 */

const api = async (formData, callback, DOMElement) => {
  try {
    console.dir(DOMElement);
    const data = await fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
      method: "POST",
      body: formData
    });
    console.log(data);
    if (data.status === 201 || data.status === 200) {
      DOMElement.classList.add("success");
      setTimeout(() => {
        DOMElement.classList.remove("success");
      }, 5000);
    }
    console.log(DOMElement);

    const findTotal = await fetch(
      "http://hapi.fhir.org/baseDstu3/Binary/_history?"
    );
    const findTotalJSON = await findTotal.json();
    console.log(findTotalJSON);
    const { total } = findTotalJSON;

    callback(total);
  } catch (error) {
    console.log(error);
  }
};

module.exports = api;

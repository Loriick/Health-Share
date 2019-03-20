/**
 * @param {file} formDatas
 * @callback
 * @param {Node} DOMElement
 * @desc post file to the api get the total binary et display it in the screen
 *
 */

const api = async (formData, callback, DOMElement) => {
  try {
    const data = await fetch("https://fhirtest.uhn.ca/baseDstu3/Binary", {
      method: "POST",
      body: formData
    });
    if (data.status === 201 || data.status === 200) {
      DOMElement.classList.add("success");
      setTimeout(() => {
        DOMElement.classList.remove("success");
      }, 5000);
    }

    const findTotal = await fetch(
      "http://hapi.fhir.org/baseDstu3/Binary/_history?"
    );
    const findTotalJSON = await findTotal.json();
    const { total } = findTotalJSON;

    callback(total);
  } catch (error) {
    console.error("Error happened", error);
  }
};

module.exports = api;

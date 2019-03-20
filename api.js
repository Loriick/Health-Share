/**
 * @param {file} formDatas
 * @callback
 */

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
    callback(total);
  } catch (error) {
    console.log(error);
  }
};

module.exports = api;

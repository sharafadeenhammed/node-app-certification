const  NodeGeocoder = require("node-geocoder");
const options = {
    provider: "mapquest",
    // provider:  process.env.GEOCODER_PROVIDER,
    httpAdapter:"https",
    // Optional depending on the providers
    // fetch: customFetchImplementation,
    // "akl098kp4DFMUlV9FM6hom7XyVeA7Ghu",
    apiKey: "akl098kp4DFMUlV9FM6hom7XyVeA7Ghu",
    // apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };

const geocoder = NodeGeocoder(options);
module.exports = geocoder;
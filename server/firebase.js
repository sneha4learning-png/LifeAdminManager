const { onRequest } = require("firebase-functions/v2/https");
const app = require("./src/app");

exports.api = onRequest({
  region: "us-central1", // Change this based on your preference
  memory: "256MiB",
  timeoutSeconds: 60,
}, app);

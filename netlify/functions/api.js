// netlify/functions/api.js
const app = require("../../src/app"); // point to your express app
module.exports = { handler: app.handler };

const path = require("path");

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");

module.exports = { CLIENT_ORIGIN, UPLOADS_DIR };

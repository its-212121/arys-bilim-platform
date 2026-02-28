const path = require("path");

const CLIENT_ORIGIN = "http://localhost:5173";

const APPLY_FORM_URL = "https://docs.google.com/forms/d/e/REPLACE_ME/viewform";

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

module.exports = { CLIENT_ORIGIN, APPLY_FORM_URL, UPLOADS_DIR };

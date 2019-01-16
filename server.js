// Dependencies
// =============================================================
const express = require("express");
const bodyParser = require("body-parser");
const compression = require('compression');
const path = require("path");

// Check for production
// =============================================================
const production = process.env.NODE_ENV == "production";

// Sets up the Express App
// =============================================================
const app = express();
let PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

//apply production settings
if (production) {
    // compress responses
    app.use(compression());
    // permit access to public file
    app.use(express.static(path.join(__dirname, '/public'), {maxage: '1y'}));
} else {
    // permit access to public file
    app.use(express.static(path.join(__dirname, '/public')))
};

// Import Routes
// =============================================================
require("./routes/routes.js")(app);

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});

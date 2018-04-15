// Dependencies
// =============================================================
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require('compression');

// Check for production
// =============================================================
const production = process.env.NODE_ENV == "production" ? true : false;

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

if (production) {
    // compress responses
    app.use(compression());
    // permit access to public file
    app.use(express.static(path.join(__dirname, '/public'), {maxage: '1y'}));
} else {
    // permit access to public file
    app.use(express.static(path.join(__dirname, '/public')))
};

// Routes
// =============================================================

// homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// redirect any route to homepage
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//handle Googles robots
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

//handle sitemap request
app.get('/sitemap.xml', function (req, res) {
    res.sendFile(path.join(__dirname, "public/sitemap.xml"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});

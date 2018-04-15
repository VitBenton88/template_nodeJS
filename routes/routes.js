// Routes
// =============================================================
module.exports = function(app) {
    // homepage route
    app.get("/", (req, res) => {
      res.send("./public/index.html");
    });

    // redirect any route to homepage
    app.get("/*", (req, res) => {
      res.send("./public/index.html");
    });

    //handle Googles robots
    app.get('/robots.txt', function (req, res) {
        res.type('text/plain');
        res.send("User-agent: *\nDisallow: /");
    });

    //handle sitemap request
    app.get('/sitemap.xml', function (req, res) {
        res.send("./public/sitemap.xml");
    });
};

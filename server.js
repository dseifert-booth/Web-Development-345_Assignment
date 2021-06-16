var express = require('express');
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express Server is listening on :" + HTTP_PORT)
}

app.get("/src/index.html", function(req, res) {
    res.sendFile(path.join(__dirname, "src/index.html"));
});

app.get("/src/listing.html", function(req, res) {
    res.sendFile(path.join(__dirname, "src/listing.html"));
});

app.get("/src/register.html", function(req, res) {
    res.sendFile(path.join(__dirname, "src/register.html"));
});

app.listen(HTTP_PORT, onHttpStart);
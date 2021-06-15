var express = require('express');
var app = express();
var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express Server is listening on :" + HTTP_PORT)
}

app.get("/", function(req, res) {
    res.send("Hello World <br /><a href='/listing'>Go to the listing page</a>");
});

app.get("/listing", function(req,res) {
    res.sendFile(path.join(__dirname, "views/listing.html"));
});

app.listen(HTTP_PORT, onHttpStart);
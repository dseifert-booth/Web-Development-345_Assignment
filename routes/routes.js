var express = require('express');
var app = express();
var path = require("path");

function load(res, signedIn, file) {
    if (signedIn) {
        res.render(file, {
            signedIn: true,
            layout: false
        });
    } else {
        res.render(file, {
            signedIn: false,
            layout: false
        });
    }
}

module.exports = {
    load: load
}
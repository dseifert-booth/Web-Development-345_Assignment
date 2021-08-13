var express = require('express');
var app = express();
var path = require("path");

function load(res, req, error, file) {
    if (req) {
        res.render(file, {
            user: req.session.user,
            error: error,
            layout: false
        });
    } else {
        res.render(file, {
            user: false,
            error: error,
            layout: false
        });
    }
}

module.exports = {
    load: load
}
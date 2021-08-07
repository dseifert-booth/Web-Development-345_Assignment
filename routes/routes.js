var express = require('express');
var app = express();
var path = require("path");

function load(res, req, admin, file) {
    if (req) {
        res.render(file, {
            user: req.session.user,
            layout: false
        });
    } else {
        res.render(file, {
            user: false,
            layout: false
        });
    }
}

module.exports = {
    load: load
}
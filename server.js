var express = require('express');
const exphbs = require('express-handlebars');
var app = express();
var path = require("path");
var val = require("./validate.js");

var signedIn = false;

app.use(express.urlencoded({ extended: true }));
app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    helpers: { 
        passErrorValue: function(options){
            return password == options
        },
    }
}));
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express Server is listening on :" + HTTP_PORT)
}

app.use(express.static(path.join(__dirname, 'static')));

app.get("/", function(req, res) {
    res.render("index", {
        layout: false
    });
});

app.get("/index", function(req, res) {
    res.render("index", {
        layout: false
    });
});

app.get("/listing", function(req, res) {
    res.render("listing", {
        layout: false
    });
});

app.get("/register", function(req, res) {
    res.render("register", {
        layout: false
    });
});

app.post("/register-user", function(req, res) {
    const formData = req.body;
    
    var errorData = {
        email: false,
        fname: false,
        lname: false,
        password1: false,
        password2: false,
        password3: false,
        bday: false
    }

    errorData = val.validateRegister(formData, errorData);

    if (val.checkValid(errorData)) {
        res.render("index", {
            layout: false
        });
    } else {
        res.render("register", {
            data: errorData,
            layout: false
        });
    }
})

app.get("/login", function(req, res) {
    res.render("login", {
        layout: false
    });
});

app.post("/signin", function(req, res) {
    const formData = req.body;
    var errorData = {
        email = false,
        password = false
    }

    errorData = val.validateLogin(formData, errorData);

    if (val.checkValid(errorData)) {
        res.render("index", {
            layout: false
        });
    } else {
        res.render("login", {
            data: errorData,
            layout: false
        });
    }
});

app.use((req,res) => {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);
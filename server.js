var express = require('express');
const exphbs = require('express-handlebars');
var app = express();
var path = require("path");
var val = require("./validate.js");

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

var User = {
    email: this.email,
    password: this.password,
    fname: this.fname,
    lname: this.lname,
    birthday: this.birthday
}

app.post("/register-user", function(req, res) {
    const formData = req.body;
    var valid = val.validateForm(formData);
    
    var errorData = {
        email: false,
        fname: false,
        lname: false,
        password1: false,
        password2: false,
        password3: false,
        bday: false,
    }

    if (valid.every(val.checkValid) == false) {
        if (valid[0]) {
            errorData.email = true;
        }
        if (valid[1]) {
            errorData.fname = true;
        }
        if (valid[2]) {
            errorData.lname = true;
        }

        if (valid[3]) {
            if (valid[3] == 1) {
                errorData.password1 = true;
            } else if (valid[3] == 2) {
                errorData.password2 = true;
            } else if (valid[3] == 3) {
                errorData.password3 = true;
            }
        }

        if (valid[4] ||
            valid[5] ||
            valid[6]) {
                errorData.bday = true;
        }

        res.render("register", {
            data: errorData,
            layout: false
        });
    } else {
        res.render("index", {
            layout: false
        });
    }
})

app.get("/signin", function(req, res) {
    res.render("signin", {
        layout: false
    });
});

app.use((req,res) => {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);
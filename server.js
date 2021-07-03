var express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
var app = express();
var path = require("path");
var val = require("./validate.js");

// this is planned for when i will need users to be able to remain logged in
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
        signedIn: false,
        layout: false
    });
});

app.get("/index", function(req, res) {
    if (signedIn) {
        res.render("index", {
            signedIn: true,
            layout: false
        });
    } else {
        res.render("index", {
            signedIn: false,
            layout: false
        });
    }
});

app.get("/listing", function(req, res) {
    if (signedIn) {
        res.render("listing", {
            signedIn: true,
            layout: false
        });
    } else {
        res.render("listing", {
            signedIn: false,
            layout: false
        });
    }
});

app.get("/register", function(req, res) {
    if (signedIn) {
        res.render("register", {
            signedIn: true,
            layout: false
        });
    } else {
        res.render("register", {
            signedIn: false,
            layout: false
        });
    }
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

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'daseifertbooth@gmail.com',
                pass: 'Nintendo34435'
            }
        })

        const mailOptions = {
            from: 'daseifertbooth@gmail.com',
            to: formData.email,
            subject: 'Welcome to Airbnb!',
            text: 'Glad to have you, ' + formData.fname + ' ' + formData.lname + '!',
            replyTo: 'daseifertbooth@gmail.com'
        }

        transporter.sendMail(mailOptions, function(err, res) {
            if (err) {
                console.error('there was an error: ', err);
            } else {
                console.log('here is the res: ', res)
            }
        })

        signedIn = true;

        res.redirect("dashboard");
    } else {
        res.redirect("register");
    }
})

app.get("/dashboard", function(req, res) {
    res.render("dashboard", {
        signedIn: true,
        layout: false
    })
})

app.get("/logout", function(req, res) {
    signedIn = false;
    res.redirect("index", {
        signedIn: false,
        layout: false
    })
})

app.get("/login", function(req, res) {
    res.render("login", {
        signedIn: false,
        layout: false
    });
});

app.post("/signin", function(req, res) {
    const formData = req.body;
    var errorData = {
        email: false,
        password: false
    }

    errorData = val.validateLogin(formData, errorData);

    if (val.checkValid(errorData)) {

        signedIn = true;

        res.redirect("dashboard");
    } else {
        res.redirect("login");
    }
});

app.use((req,res) => {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);
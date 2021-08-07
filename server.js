var express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
var app = express();
var path = require('path');
var clientSessions = require("client-sessions");

var val = require("./validate.js");
var user = require("./user.js");
var route = require("./routes/routes.js");

var admin = false;

var errorData = {
    email1: false,
    email2: false,
    fname: false,
    lname: false,
    password0: false,
    password1: false,
    password2: false,
    password3: false,
    bday: false
}

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

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

app.use(express.static(path.join(__dirname, 'static')));

app.use(clientSessions({
    cookieName: "session",
    secret: "pvWJ50126viCTU5ca%2g",
    duration: 5 * 60 * 1000,
    activeDuration: 2 * 60 * 1000
}));

function createSession(req, sessionUser) {
    req.session.user = {
        email: sessionUser.email,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName,
        birthday: sessionUser.birthday,
        admin: sessionUser.admin
    }
}

app.use(express.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    val.setEmpty(errorData);
    route.load(res, req, "index");
});

app.get("/index", function(req, res) {
    val.setEmpty(errorData);
    route.load(res, req, "index");
});

app.get("/listing", function(req, res) {
    val.setEmpty(errorData);
    route.load(res, req, "listing");
});

app.get("/register", function(req, res) {
    val.setEmpty(errorData);
    route.load(res, false, "register");
});

app.post("/register", async function(req, res) {
    val.setEmpty(errorData);
    const formData = req.body;
    var newUser;

    errorData = val.validateRegister(formData, errorData);

    if (!errorData.email1) {
        newUser = await user.findUser(formData.email);
        user.checkNewUser(newUser, errorData);
    }
    
    if (val.checkValid(errorData)) {

        newUser = user.createUser(formData);

        user.saveUser(newUser);

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

        createSession(req, newUser);

        res.redirect("dashboard");
    } else {
        res.redirect("register");
    }
})

app.get("/dashboard", ensureLogin, function(req, res) {
    val.setEmpty(errorData);
    route.load(res, req, "dashboard");
})

app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("index");
})

app.get("/login", function(req, res) {
    val.setEmpty(errorData);
    route.load(res, false, "login");
});

app.post("/login", async function(req, res) {
    val.setEmpty(errorData);
    const formData = req.body;
    var existingUser;

    errorData = val.validateLogin(formData, errorData);

    if (!errorData.email1) {
        existingUser = await user.findUser(formData.email);
        user.checkExistingUser(existingUser, formData.password, errorData);
    }

    if (val.checkValid(errorData)) {
        if (existingUser.admin) {
            admin = true;
        }
        
        createSession(req, existingUser);

        res.redirect("dashboard");
    } else {
        res.redirect("login");
    }
});

app.use((req,res) => {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);
var express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var val = require("./validate.js");
var user = require("./user.js");
var route = require("./routes/routes.js");

mongoose.connect("mongodb+srv://dseifert-booth:Nintendo!34435@senecaweb322.qt5gp.mongodb.net/web322_assignment?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

var signedIn = false;
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

// var userSchema = new Schema({
//     "email": {
//         "type": String,
//         "unique": true
//     },
//     "firstName": String,
//     "lastName": String,
//     "password": String,
//     "birthday": String,
//     "admin": {
//         "type": Number,
//         "default": 0
//     }
// })

//var User = mongoose.model("web322_assignment.users", userSchema);

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
    val.setEmpty(errorData);
    res.render("index", {
        signedIn: false,
        layout: false
    });
});

app.get("/index", function(req, res) {
    val.setEmpty(errorData);
    route.load(res, signedIn, "index");
});

app.get("/listing", function(req, res) {
    val.setEmpty(errorData);
    route.load(res, signedIn, "listing");
});

app.get("/register", function(req, res) {
    val.setEmpty(errorData);
    res.render("register", {
        signedIn: false,
        layout: false
    })
});

app.post("/register-user", function(req, res) {
    val.setEmpty(errorData);
    const formData = req.body;
    
    errorData = val.validateRegister(formData, errorData);

    if (!errorData.email1) {
        User.find({email: formData.email})
        .exec()
        .then((user) => {
            if (user) {
                errorData.email2 = true;
            }
        })
    }
    
    if (val.checkValid(errorData)) {

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(formData.password, salt);

        var newUser = new User({
            email: formData.email,
            firstName: formData.fname,
            lastName: formData.lname,
            password: hash,
            birthday: formData.month + " " + formData.day + ", " + formData.year
        })

        newUser.save((err) => {
            if (err) {
                console.log(`There was an error saving ` + newUser.firstName + `'s account ${err}`)
            } else {
                console.log(newUser.firstName + "'s account was saved to the database.")
            }
            process.exit();
        })

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
        res.render("register", {
            data: errorData,
            signedIn: false,
            layout: false
        })
    }
})

app.get("/dashboard", function(req, res) {
    val.setEmpty(errorData);
    res.render("dashboard", {
        signedIn: true,
        layout: false
    })
})

app.get("/logout", function(req, res) {
    signedIn = false;
    res.redirect("index")
})

app.get("/login", function(req, res) {
    val.setEmpty(errorData);
    res.render("login", {
        signedIn: false,
        layout: false
    })
});

app.post("/signin", function(req, res) {
    val.setEmpty(errorData);
    const formData = req.body;
    var admin = false;

    errorData = val.validateLogin(formData, errorData);

    if (!errorData.email1) {
        user.findUser(formData.email, errorData);
        user.checkPassword(formData.email, formData.password, errorData)
        console.log("After finding user: ");
        console.log(errorData);
    }

    console.log("After error checks: ");
    console.log(errorData);

    if (val.checkValid(errorData)) {
        //console.log(errorData);
        res.redirect("dashboard");
    } else {
        console.log("Errors found");
        res.render("login", {
            data: errorData,
            signedIn: false,
            layout: false
        })
    }
});

app.use((req,res) => {
    res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, onHttpStart);
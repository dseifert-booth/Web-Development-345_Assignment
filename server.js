var express = require('express');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
var app = express();
const multer = require('multer');
var path = require('path');
var clientSessions = require("client-sessions");

var val = require("./static/js/validate.js");
var dbUser = require("./static/js/db-user.js");
var dbRoom = require("./static/js/db-room.js");
var route = require("./routes/routes.js");

var loginErrorData = {
    email1: false,
    email2: false,
    password1: false,
    password2: false
}

var registerErrorData = {
    email1: false,
    email2: false,
    fname: false,
    lname: false,
    password1: false,
    password2: false,
    password3: false,
    bday: false
}

var roomErrorData = {
    title: false,
    price: false,
    desc: false,
    location: false,
    photo: false
}

var bookErrorData = {
    login: false,
    booked: false,
    dates1: false,
    dates2: false,
    guests: false
}

var roomNum;

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

const storage = multer.diskStorage({
    destination: "./static/images/",
    filename: function(req, file, cb) {
        if (file) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }
});

const upload = multer({ storage: storage });

function ensureLogin(redirect) {
    return function(req, res, next) {
        if (!req.session.user) {
            res.redirect(redirect);
        } else {
            next();
        }
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

app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    val.setEmpty(loginErrorData);
    val.setEmpty(registerErrorData);
    val.setEmpty(roomErrorData);
    route.load(res, req, false, "index");
});

app.get("/index", function(req, res) {
    val.setEmpty(loginErrorData);
    val.setEmpty(registerErrorData);
    val.setEmpty(roomErrorData);
    val.setEmpty(bookErrorData);
    route.load(res, req, false, "index");
});

app.get("/listing", function(req, res) {
    val.setEmpty(loginErrorData);
    val.setEmpty(registerErrorData);
    val.setEmpty(bookErrorData);
    route.load(res, req, roomErrorData, "listing");
});

app.get("/room-display", async function(req, res) {
    var rooms = await dbRoom.findRooms();
    res.json(rooms);
});

app.get("/room-count", async function(req, res) {
    const count = await dbRoom.countRooms();
    res.json(count);
});

app.get("/search-rooms", async function(req, res) {
    console.log("server #1");
    console.log(req.query.location);
    var listing = {
        rooms: await dbRoom.findRooms(req.query.location),
        count: await dbRoom.countRooms(req.query.location)
    }
    console.log(listing);
    res.json(listing);
})

app.post("/add-room", upload.single("photo"), async (req, res) => {
    val.setEmpty(roomErrorData);
    const formData = req.body;

    if (!req.file) {
        roomErrorData.photo = true;
    }

    val.validateRoom(formData, roomErrorData);

    if (val.checkValid(roomErrorData)) {
        var newRoom = await dbRoom.createRoom(formData, req.file.filename);
        dbRoom.saveRoom(newRoom);
        res.redirect("listing");
    } else {
        res.redirect("listing");
    }
    
    route.load(res, req, roomErrorData, "listing");
})

app.get("/room-desc", function(req, res) {
    val.setEmpty(loginErrorData);
    val.setEmpty(registerErrorData);
    val.setEmpty(roomErrorData);

    roomNum = req.query.room;

    route.load(res, req, bookErrorData, "room-desc");
})

app.post("/room-desc", async function(req, res) {
    val.setEmpty(bookErrorData);
    var formData = req.body;

    if (!req.session.user) {
        bookErrorData.login = true;
    } else {
        if (req.session.user.roomBooked) {
            bookErrorData.booked = true
        } else {
            bookErrorData = val.validateBooking(formData, bookErrorData);
        }
    }

    if (val.checkValid(bookErrorData)) {
        dbRoom.bookRoom(roomNum);
        dbUser.userBooksRoom(req.session.user.email);

        var bookedRoom = await dbRoom.getRoom(roomNum);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'daseifertbooth@gmail.com',
                pass: 'Nintendo34435'
            }
        })

        const mailOptions = {
            from: 'daseifertbooth@gmail.com',
            to: req.session.user.email,
            subject: 'Your room has been booked!',
            text: 'Thank you for your payment, your room "' + bookedRoom.title + '" is ready and waiting for you!',
            replyTo: 'daseifertbooth@gmail.com'
        }

        transporter.sendMail(mailOptions, function(err, res) {
            if (err) {
                console.error('there was an error: ', err);
            } else {
                console.log('here is the res: ', res)
            }
        })

        res.redirect("/listing");
    } else {
        res.redirect("/room-desc?room=" + roomNum);
    }

})

app.get("/room-data", async function(req, res) {
    roomData = await dbRoom.getRoom(roomNum);
    
    if (roomData.booked) {
        res.redirect("/listing");
    }

    res.json(roomData);
})

app.get("/register", function(req, res) {
    val.setEmpty(loginErrorData);
    val.setEmpty(roomErrorData);
    val.setEmpty(bookErrorData);
    route.load(res, false, registerErrorData, "register");
});

app.post("/register", async function(req, res) {
    val.setEmpty(registerErrorData);
    const formData = req.body;
    var newUser;

    registerErrorData = val.validateRegister(formData, registerErrorData);

    if (!registerErrorData.email1) {
        newUser = await dbUser.findUser(formData.email);
        dbUser.checkNewUser(newUser, registerErrorData);
    }
    
    if (val.checkValid(registerErrorData)) {

        newUser = dbUser.createUser(formData);

        dbUser.saveUser(newUser);

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

app.get("/dashboard", ensureLogin("/login"), function(req, res) {
    val.setEmpty(loginErrorData);
    val.setEmpty(registerErrorData);
    val.setEmpty(roomErrorData);
    val.setEmpty(bookErrorData);
    route.load(res, req, false, "dashboard");
})

app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("index");
})

app.get("/login", function(req, res) {
    val.setEmpty(registerErrorData);
    val.setEmpty(roomErrorData);
    val.setEmpty(bookErrorData);
    route.load(res, false, loginErrorData, "login");
});

app.post("/login", async function(req, res) {
    val.setEmpty(loginErrorData);
    const formData = req.body;
    var existingUser;

    loginErrorData = val.validateLogin(formData, loginErrorData);

    if (!loginErrorData.email1) {
        existingUser = await dbUser.findUser(formData.email);
        dbUser.checkExistingUser(existingUser, formData.password, loginErrorData);
    }

    if (val.checkValid(loginErrorData)) {
        
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
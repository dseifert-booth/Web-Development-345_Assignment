const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

mongoose.connect("mongodb+srv://dseifert-booth:Nintendo!34435@senecaweb322.qt5gp.mongodb.net/web322_assignment?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

var userSchema = new Schema({
    "email": {
        "type": String,
        "unique": true
    },
    "firstName": String,
    "lastName": String,
    "password": String,
    "birthday": String,
    "admin": {
        "type": Number,
        "default": 0
    }
})

var User = mongoose.model("web322_assignment.users", userSchema);

function findUser(userEmail) {
    return User.findOne({email: userEmail}).exec();
}

function checkNewUser(user, errorData) {
    if (user) {
        errorData.email2 = true;
    }
}

function checkExistingUser(user, userPassword, errorData) {
    if (!user) {
        errorData.email2 = true;
    } else {
        if (!bcrypt.compareSync(userPassword, user.password)) {
            errorData.password1 = true;
        }
    }
}

function createHash(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function createUser(formData) {
    var newUser = new User ({
        email: formData.email,
        firstName: formData.fname,
        lastName: formData.lname,
        password: createHash(formData.password),
        birthday: formData.month + " " + formData.day + ", " + formData.year
    })
    return newUser;
}

function saveUser(user) {
    user.save((err) => {
        if (err) {
            console.log(`There was an error saving ` + user.firstName + `'s account ${err}`)
        } else {
            console.log(user.firstName + "'s account was saved to the database.")
        }
        process.exit();
    })
}

module.exports = {
    findUser: findUser,
    checkNewUser: checkNewUser,
    checkExistingUser: checkExistingUser,
    createUser: createUser,
    saveUser: saveUser
}
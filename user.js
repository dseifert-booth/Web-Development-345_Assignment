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

function findUser(userEmail, errorData) {
    User.findOne({email: userEmail})
    .exec()
    .then((user) => {
        if (user) {
            console.log("user found")
        } else {
            console.log("user not found")
            errorData.email2 = true;
        }
    })
}

function checkPassword(userEmail, userPassword, errorData) {
    User.findOne({email: userEmail})
    .exec()
    .then((user) => {
        if (user) {
            if (bcrypt.compareSync(userPassword, user.password)) {
                console.log("password match")
            } else {
                console.log("password not match")
                errorData.password1 = true;
            }
        }
    })
}

module.exports = {
    findUser: findUser,
    checkPassword: checkPassword
}
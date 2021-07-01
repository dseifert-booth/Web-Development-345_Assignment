function validateRegister(body, error) {
    const charRegex = /[a-zA-Z]+/;
    const numRegex = /[0-9]+/;
    const sizeRegex = /.{6,}/

    if (body.email == "") { error.email = true;}
    if (body.fname == "") {error.fname = true;}
    if (body.lname == "") {error.lname = true;}

    if (body.password == "") {error.password1 = true;} 
    else {
        if (body.password.length > 12 || sizeRegex.test(body.password) == false) {error.password2 = true;} 
        else if(charRegex.test(body.password) == false || numRegex.test(body.password) == false) {error.password3 = true;}
    }
    
    if (body.month == "month") {error.bday = true;}
    if (body.day == "day") {error.bday = true;}
    if (body.year == "year") {error.bday = true;}

    return error;
}

function validateLogin(body, error) {
    if (body.email == "") { error.email = true;}
    if (body.password == "") {error.password = true;} 

    return error;
}

function checkValid(error) {
    var valid = true;

    for (var key in error) {
        if (error[key] == true) {
            valid = false;
            break;
        }
    }

    return valid;
}

module.exports = {
    validateRegister: validateRegister,
    validateLogin: validateLogin,
    checkValid: checkValid
}
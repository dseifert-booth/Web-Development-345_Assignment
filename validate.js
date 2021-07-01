function validateForm(body) {
    var valid = [0,0,0,0,0,0,0];
    const charRegex = /[a-zA-Z]+/;
    const numRegex = /[0-9]+/;
    const sizeRegex = /.{6,}/

    if (body.email == "") { valid[0] = 1;}
    if (body.fname == "") {valid[1] = 1;}
    if (body.lname == "") {valid[2] = 1;}

    if (body.password == "") {valid[3] = 1;} 
    else {
        if (body.password.length > 12 || sizeRegex.test(body.password) == false) { valid[3] = 2;} 
        else if(charRegex.test(body.password) == false || numRegex.test(body.password) == false) {valid[3] = 3;}
    }
    
    if (body.month == "month") {valid[4] = 1;}
    if (body.day == "day") {valid[5] = 1;}
    if (body.year == "year") {valid[6] = 1;}

    return valid;
}

function checkValid(value) {
    return value == 0;
}

module.exports = {
    validateForm: validateForm,
    checkValid: checkValid
}
export function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email))
        return true;
    else
        return false;

}

export function validateLenght(value, length) {
    if (!value)
        return false;
    if (value.length < length)
        return false;
    return true;
}

export function require(value) {
    if (!value)
        return false;
}
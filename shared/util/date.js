function toDoubleDigit(val) {
    if (val < 10) {
        val = '0' + val;
    }
    return val;
}

function getDateTime() {
    const t = new Date();
    return t.getFullYear()
        + "/" + toDoubleDigit(t.getMonth() + 1)
        + "/" + toDoubleDigit(t.getDate())
        + " " + toDoubleDigit(t.getHours())
        + ":" + toDoubleDigit(t.getMinutes())
        + ":" + toDoubleDigit(t.getSeconds())
        + "." + toDoubleDigit(t.getMilliseconds())
}

module.exports = {

    getDateTime,
};

const repeatString = function(string, num) {
    let cattedString = "";
    if (num >= 0) {
        for (let i = 0; i < num; i++) {
            cattedString += string;
        }
    }
    else {
        cattedString = "ERROR";
    }
    return cattedString;
};

// Do not edit below this line
module.exports = repeatString;

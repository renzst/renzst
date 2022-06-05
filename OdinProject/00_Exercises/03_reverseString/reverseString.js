const reverseString = function(string) {
    let reversedString = ""
    for(let i = string.length; i > 0; i--) {
        reversedString += string[i-1];
    }
    return reversedString;
};

// Do not edit below this line
module.exports = reverseString;

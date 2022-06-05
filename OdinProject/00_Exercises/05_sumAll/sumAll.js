const sumAll = function(a, b) {
    // validate
    for (let p of [a,b]) {
        if (typeof p != "number" | p < 0) {
            return "ERROR";
        }
    }
    if (a == b) {
        return "ERROR";
    }

    const smallerParam = a < b ? a : b;
    const biggerParam = a < b ? b : a;

    sum = 0;
    for (let i = smallerParam; i <= biggerParam; i++) {
        sum += i;
    }

    return sum;

};

// Do not edit below this line
module.exports = sumAll;

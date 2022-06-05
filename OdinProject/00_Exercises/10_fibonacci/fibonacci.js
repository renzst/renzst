const fibonacci = function(n) {
    if (n < 1) return "OOPS";
    fibArray = []
    for (let i = 0; i < n; i++) {
        if (i == 0 | i == 1) {
            fibArray.push(1);
        }
        else {
            fibArray.push(fibArray[i-1] + fibArray[i-2]);
        }
    }
    return fibArray[n-1];
};

// Do not edit below this line
module.exports = fibonacci;

const removeFromArray = function(array, ...features) {
    newArray = []
    for (let element of array) {
        let pushFlag = true;
        for (let feature of features) {
            if (element === feature) {
                pushFlag = false;
                break;
            }
        }
        if (pushFlag) {
            newArray.push(element);
        }
    }
    return newArray;
};

// Do not edit below this line
module.exports = removeFromArray;

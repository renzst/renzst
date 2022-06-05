const opSearch = /(\+|-|\*|\/|\^)/;

function operate(expArr) {
    if (expArr) {
        //console.log(`Recursing on ${expArr}`)
        if (expArr.length == 3) {
            //console.log(`Evaluating ${expArr}`)
            let left = expArr[0];
            let right = expArr[2];

            switch (expArr[1]) {
                case "+" : return add(+left, +right);
                case "-" : return subtract(+left, +right);
                case "*" : return multiply(+left, +right);
                case "/" : return divide(+left, +right);
                case "^" : return power(+left, +right);
            }
        }

        else {
            let priorityPos = 1; // default position

            let powerPos = expArr.lastIndexOf("^");
            if (powerPos != -1) {
                priorityPos = powerPos;
            }
            else {
                let mulDivPos = expArr.findIndex(x => x == "*"|x == "/");
                if (mulDivPos != -1) {
                    priorityPos = mulDivPos
                }
            }

            let substituteExp = expArr.slice(priorityPos-1, priorityPos+2);
            let substitute = String(operate(substituteExp));
            expArr.splice(priorityPos-1, 3, substitute);
            return(operate(expArr));

        }
    }
}

function validate(expStr) {
    let strippedString = "";
    for (char of expStr) {
        if (char.match(/[0-9]|\.|\+|-|\*|\/|\^/)) {
            strippedString += char;
        }
    }
    //console.log(`Validating ${strippedString}`)
    let expArr = strippedString.split(opSearch).filter(x => x != "");
    //console.log(expArr);
    for (let i = 0; i < expArr.length; i++) {
        if ( (i % 2 == 0 & isNaN(+expArr[i])) ) {
            if (expArr[i] == "-") {
                let negSub = expArr[i] + expArr[i+1];
                expArr.splice(i, 2, negSub);
            }
            else {
                console.error("Your expression was malformed.")
                return undefined;
            }
        }
        if ( (i % 2 == 1 & !isNaN(+expArr[i])) ) {
            console.error("Your expression was malformed.")
            return undefined;
        }
    }
    
    return expArr;
}

function add(x, y) {return x + y}

function subtract(x, y) {return x - y}

function multiply(x, y) {return x * y}

function divide(x, y) {
    if (y == 0) {
        console.error("Division by zero error");
        return undefined;
    }
    else {return x / y}
}

function power(x, y) {
    return Math.pow(x, y);
}

function initializeCalculator() {
    let expString = "";
    let lastCalc = "";
    const expDisplay = document.querySelector("#display");
    const lastCalcDisplay = document.querySelector("#lastcalc");
    const valueButtons = document.querySelectorAll("#calculator > .digit, #calculator > .operator");
    for (let b of valueButtons) {
        b.addEventListener("click", () => {
            expString += b.value;
            expDisplay.textContent = expString;
        })
    }

    const clearAll = document.querySelector("#ac");
    clearAll.addEventListener("click", () => {
        expString = "";
        lastCalc = "";
        expDisplay.textContent = expString;
        lastCalcDisplay.textContent = lastCalc;
    });

    const clearLast = document.querySelector("#backspace");
    clearLast.addEventListener("click", () => {
        if (expString.length != 0) {
            expString = expString.slice(0, expString.length - 1);
            expDisplay.textContent = expString;
        }
    });

    const submit = document.querySelector("#equal");
    submit.addEventListener("click", () => {
        let result = operate(validate(expString));
        lastCalc = expString + "=" + result;
        lastCalcDisplay.textContent = lastCalc;
        expString = result == undefined ? "ERROR" : result;
        expDisplay.textContent = expString;
    })
}

initializeCalculator();
const add = function(x, y) {
	return x + y;
};

const subtract = function(x, y) {
	return x - y;
};

const sum = function(arr) {
  return arr.reduce((cum, curr) => {return cum + curr}, 0);
};

const multiply = function(arr) {
  return arr.reduce((cum, curr) => {return cum * curr}, 1);
};

const power = function(x, p) {
  let cum = 1;
	for (let i = 0; i < p; i++) {
    cum *= x;
  }
  return cum;
};

const factorial = function(n) {
	let f = 1;
  for (i = 1; i <= n; i++) {
    f *= i;
  }
  return f;
};

// Do not edit below this line
module.exports = {
  add,
  subtract,
  sum,
  multiply,
  power,
  factorial
};

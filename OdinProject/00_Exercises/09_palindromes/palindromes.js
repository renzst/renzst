const palindromes = function (string) {
  let arr = [];
  for (let char of string.toLowerCase()) {
      if (char.match(/[a-z]/)) {
        arr.push(char);
      }
  }
  for (let i = 0; i < arr.length/2; i++) {
      if (arr[i] != arr[arr.length-1-i]) {
          return false;
      }
  }
  return true;
};

// Do not edit below this line
module.exports = palindromes;

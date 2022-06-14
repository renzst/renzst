function ORDINAL(input) {
  const ordinalize = (n) => {
    let suffix;
    if ((n >= 11 && n <= 19) || (n % 10 >= 4 && n % 10 <= 9) || (n % 10 == 0)) {
        suffix = "th";
    }
    else if (n % 10 == 1) {
        suffix = "st";
    }
    else if (n % 10 == 2) {
        suffix = "nd";
    }
    else if (n % 10 == 3) {
        suffix = "rd";
    }
    else {
        suffix = ""
    }
    console.log(n, n%10, suffix);
    return String(n) + suffix;
  }
  return Array.isArray(input) ?
    input.map(row => ordinalize(row)) :
    ordinalize(input);
}

ORDINAL(4);
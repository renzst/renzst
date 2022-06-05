const ftoc = function(fah) {
    let c = (fah-32) * 5/9;
    c = Math.trunc(c) + Number((c%1).toPrecision(1));
    return (c)
};

const ctof = function(cel) {
    let f = (cel * 9/5) + 32;
    f = Math.trunc(f) + Number((f%1).toPrecision(1));
    return (f);
};

// Do not edit below this line
module.exports = {
  ftoc,
  ctof
};

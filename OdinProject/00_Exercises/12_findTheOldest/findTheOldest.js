const findTheOldest = function(people) {
  let ages = people.map(p => {
      const now = new Date();
      return {
        name: p.name, 
        age: ('yearOfDeath' in p) ? (p.yearOfDeath - p.yearOfBirth) : (now.getFullYear() - p.yearOfBirth)
    }});
  return ages.reduce((prevP, currP) => prevP.age > currP.age ? prevP : currP);
}

// Do not edit below this line
module.exports = findTheOldest;

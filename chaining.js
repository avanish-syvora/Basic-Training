// makeAllCaps() and sortWords(): Promise-based chaining of functions

function makeAllCaps(words) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(words) || words.some(word => typeof word !== "string")) {
      return reject("Array must contain only strings.");
    }
    resolve(words.map(word => word.toUpperCase()));
  });
}

function sortWords(words) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(words)) {
      return reject("Input must be an array.");
    }
    resolve(words.sort());
  });
}

// Test chaining
makeAllCaps(["banana", "apple", "mango"])
  .then(sortWords)
  .then(result => console.log("Sorted Caps:", result))
  .catch(console.error); // ➤ Sorted Caps: [ 'APPLE', 'BANANA', 'MANGO' ]


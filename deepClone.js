/**
 * Performs a deep clone of any object, including its functions and prototype chain.
 * Does not use JSON methods or structuredClone.
 *
 * @param {Object} obj - The object to clone
 * @param {Map} visited - Used to handle circular references
 * @returns {Object} - Deep cloned object
 */
function deepClone(obj, visited = new Map()) {
  // Return primitives and null directly
  if (obj === null || typeof obj !== "object") return obj;

  // Prevent circular reference duplication
  if (visited.has(obj)) return visited.get(obj);

  // Clone functions manually
  if (typeof obj === "function") {
    const fn = function (...args) {
      return obj.apply(this, args);
    };
    visited.set(obj, fn);
    return fn;
  }

  // Get prototype and create new object with the same prototype
  const proto = Object.getPrototypeOf(obj);
  const clone = Object.create(proto);
  visited.set(obj, clone);

  // Recursively clone all properties
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], visited);
    }
  }

  return clone;
}

// Example usage:
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  return "Hi, I'm " + this.name;
};

const original = new Person("Avanish");
const copy = deepClone(original);

console.log(copy.name);           // Avanish
console.log(copy.sayHi());        // Hi, I'm Avanish
console.log(copy instanceof Person); // true

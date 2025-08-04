const add = require("./operations/add");
const subtract = require("./operations/subtract");
const multiply = require("./operations/multiply");
const divide = require("./operations/divide");
const log = require("./utils/logger");

const args = process.argv.slice(2); // skip node & index.js
const [operation, a, b] = args;
const x = Number(a);
const y = Number(b);

try {
  let result;

  switch (operation) {
    case "add":
      result = add(x, y);
      break;
    case "subtract":
      result = subtract(x, y);
      break;
    case "multiply":
      result = multiply(x, y);
      break;
    case "divide":
      result = divide(x, y);
      break;
    default:
      throw new Error("Invalid operation");
  }

  console.log(`Result: ${result}`);
  log(operation, x, y, result);
} catch (err) {
  console.error("Error:", err.message);
}
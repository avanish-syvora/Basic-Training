# Node.js Calculator CLI Tool

A simple, modular Command Line Calculator built using Node.js, organized with utility functions and custom modules. It supports basic arithmetic operations and logs each calculation in a file using fs and path.

---

## Features

* Perform operations using npm run
* Arithmetic operations: Add, Subtract, Multiply, Divide
* Modular code: Organized into separate files
* Operation logging with timestamps
* Error handling for invalid input and divide-by-zero

---

## Project Structure

```
calculator-cli/
├── package.json
├── index.js
├── operations/
│   ├── add.js
│   ├── subtract.js
│   ├── multiply.js
│   ├── divide.js
├── utils/
│   └── logger.js
├── log.txt
```

---

## Setup

```bash
npm install
```

---

## Usage

```bash
npm run add 3 5         # Result: 8
npm run subtract 10 6   # Result: 4
npm run multiply 4 7    # Result: 28
npm run divide 15 3     # Result: 5
```

Results are logged in log.txt with timestamps.

---

## Modules Explained

### index.js

```js
const add = require("./operations/add");
const subtract = require("./operations/subtract");
const multiply = require("./operations/multiply");
const divide = require("./operations/divide");
const log = require("./utils/logger");

const args = process.argv.slice(2);
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
```

### operations/add.js

```js
module.exports = (a, b) => a + b;
```

### operations/subtract.js

```js
module.exports = (a, b) => a - b;
```

### operations/multiply.js

```js
module.exports = (a, b) => a * b;
```

### operations/divide.js

```js
module.exports = (a, b) => {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
};
```

### utils/logger.js

```js
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../log.txt");

function log(operation, a, b, result) {
  const line = `${new Date().toISOString()} | ${operation} ${a} ${b} = ${result}\n`;
  fs.appendFileSync(logFile, line);
}

module.exports = log;
```

---

## Example Logs (log.txt)

```
2025-07-18T11:01:02.221Z | add 3 5 = 8
2025-07-18T11:01:05.987Z | divide 20 4 = 5
```

---

## Scripts in package.json

```json
"scripts": {
  "add": "node index.js add",
  "subtract": "node index.js subtract",
  "multiply": "node index.js multiply",
  "divide": "node index.js divide"
}
```


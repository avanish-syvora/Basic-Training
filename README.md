# Node.js Calculator CLI Tool (Advanced)

A modular, extensible CLI calculator built with Node.js, equipped with modern developer tooling and support for fetching external data. Supports Babel for ES6+, ESLint with Airbnb style guide, Husky for pre-commit linting, and utility packages like `lodash`, `moment`, `node-fetch`, and `request`.

---

## Features

* Perform CLI-based arithmetic via `npm run`
* Modular operations: add, subtract, multiply, divide
* Validates input using `lodash`
* Logs results with timestamp using `fs` and `moment`
* Fetches dummy employee data using:

  * `node-fetch`
  * `request/request-promise`
* Uses Babel to support ES6+ syntax
* Enforces clean code via ESLint + Husky pre-commit hook

---

## Project Structure

```
calculator-cli/
├── babel.config.json
├── .eslintrc.json
├── .husky/
│   └── pre-commit
├── dist/                          # Compiled Babel output
├── output/                        # Saved API responses
├── package.json
├── src/
│   ├── index.js                   # Main CLI logic
│   ├── fetchEmployees.js         # API fetch using node-fetch
│   ├── fetchWithRequest.js       # API fetch using request-promise
│   ├── operations/
│   │   ├── add.js
│   │   ├── subtract.js
│   │   ├── multiply.js
│   │   ├── divide.js
│   └── utils/
│       ├── logger.js             # Logs to file
│       └── validator.js          # Input checks using lodash
```

---

## Setup Instructions

```bash
npm install
```

---

## Usage Examples

```bash
npm run add 3 5           # 8
npm run divide 10 2       # 5
npm run fetch-data        # uses node-fetch
npm run fetch-request     # uses request/request-promise
```

> Note: All arithmetic runs via Babel build (`src` → `dist`)

---

## Scripts

```json
"scripts": {
  "build": "babel src --out-dir dist",
  "start": "node dist/index.js",
  "add": "npm run build && node dist/index.js add",
  "subtract": "npm run build && node dist/index.js subtract",
  "multiply": "npm run build && node dist/index.js multiply",
  "divide": "npm run build && node dist/index.js divide",
  "fetch-data": "npm run build && node dist/fetchEmployees.js",
  "fetch-request": "npm run build && node dist/fetchWithRequest.js",
  "lint": "eslint src"
}
```

---

## Tools & Technologies Used

| Tool                          | Purpose                                    |
| ----------------------------- | ------------------------------------------ |
| `@babel/core`                 | Transpiles ES6+ JS to Node-compatible code |
| `eslint-airbnb-base`          | Lints code with Airbnb ruleset             |
| `husky`                       | Prevents dirty commits via pre-commit hook |
| `lodash`                      | Used to validate CLI input values          |
| `moment`                      | Generates timestamped log filenames        |
| `node-fetch`                  | Fetches external data (modern syntax)      |
| `request` / `request-promise` | Legacy-style HTTP requests                 |

---

## ESLint Configuration

`.eslintrc.json`:

```json
{
  "extends": "airbnb-base",
  "env": {
    "node": true,
    "es2021": true
  },
  "rules": {
    "no-console": "off"
  }
}
```

---

## Babel Configuration

`babel.config.json`:

```json
{
  "presets": ["@babel/preset-env"]
}
```

---

## Husky Pre-commit Hook

`.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run build
```



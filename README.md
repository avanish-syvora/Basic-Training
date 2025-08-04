# JavaScript Calculator Test Functions

This project provides a collection of basic arithmetic functions, each in its own module, organized into an `operations` directory. It also includes a comprehensive test suite using Jest, with tests located in a separate `tests` directory.

## Features

  * **Addition (`add.js`)**: Adds two numbers.
  * **Subtraction (`subtract.js`)**: Subtracts one number from another.
  * **Multiplication (`multiply.js`)**: Multiplies two numbers.
  * **Division (`divide.js`)**: Divides one number by another, with error handling for division by zero.

## Testing

The project uses **Jest** for testing. Each function has a dedicated test file (`.test.js`) that covers multiple scenarios, including:

  * Operations with positive and negative numbers.
  * Operations with zero.
  * Floating-point arithmetic.
  * Edge cases, such as division by zero.

## Getting Started

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and npm installed on your machine.

### Installation

1.  Clone the repository or download the files to a local directory.
2.  Navigate to the project directory in your terminal.
3.  Install Jest, which is the only development dependency:
    ```bash
    npm install --save-dev jest
    ```

### Running the Tests

To run the tests for all functions, execute the following command in your terminal:

```bash
npx jest
```

Jest will automatically find and run all test files within the `tests` directory and display a report of the results in your terminal.

## File Structure

The project is organized as follows:

```
.
├── operations/
│   ├── add.js
│   ├── subtract.js
│   ├── multiply.js
│   └── divide.js
├── tests/
│   ├── add.test.js
│   ├── subtract.test.js
│   ├── multiply.test.js
│   └── divide.test.js
└── package.json
```

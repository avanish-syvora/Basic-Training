/**
 * Calculator constructor that provides methods to read input,
 * calculate sum and multiplication of two values.
 */
function Calculator() {
  /**
   * Prompts user for two numbers and stores them in object properties.
   */
  this.read = function () {
    this.a = +prompt("Enter first number:", 0);
    this.b = +prompt("Enter second number:", 0);
  };

  /**
   * Returns the sum of the stored numbers.
   */
  this.sum = function () {
    return this.a + this.b;
  };

  /**
   * Returns the product of the stored numbers.
   */
  this.mul = function () {
    return this.a * this.b;
  };
}

// Example usage
const calc = new Calculator();
calc.read();             // Prompts for two numbers
console.log(calc.sum()); // Outputs their sum
console.log(calc.mul()); // Outputs their product

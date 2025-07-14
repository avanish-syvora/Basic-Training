/**
 * Creates a closure that returns a factorial function.
 * The returned function can compute factorials recursively.
 */
function createFactorial() {
  return function factorial(n) {
    // Base case: factorial(0) or factorial(1) = 1
    if (n <= 1) return 1;

    // Recursive case: n * factorial(n-1)
    return n * factorial(n - 1);
  };
}

// Create the factorial function using closure
const fact = createFactorial();
console.log(fact(5)); // Output: 120

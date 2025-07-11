/**
 * Returns the second largest unique number in an array.
 *
 * @param {number[]} array - Array of numbers to search.
 * @returns {number|null} The second largest number, or null if it doesn't exist.
 */
function secondLargest(array) {
  let max = -Infinity;
  let second = -Infinity;

  // Loop through each number in the array
  for (const num of array) {
    if (num > max) {
      // New max found; update both max and second
      second = max;
      max = num;
    } else if (num > second && num < max) {
      // Update second if it's a new valid candidate
      second = num;
    }
  }

  // Return null if no second largest found
  return second === -Infinity ? null : second;
}

// ✅ Test Case
console.log(secondLargest([1, 3, 4, 2, 5])); // Expected output: 4

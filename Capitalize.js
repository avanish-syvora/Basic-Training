/**
 * Capitalizes the first character of a string if it is not already uppercase.
 *
 * @param {string} str - The input string
 * @returns {string} - String with first character capitalized
 */
function capitalizeFirstChar(str) {
  // Return as is if string is empty
  if (!str) return str;

  const firstChar = str[0];

  // If already uppercase, return the original string
  if (firstChar === firstChar.toUpperCase()) {
    return str;
  }

  // Capitalize first letter and append the rest of the string
  return firstChar.toUpperCase() + str.slice(1);
}

console.log(capitalizeFirstChar("hello")); // Output: Hello
console.log(capitalizeFirstChar("Hello")); // Output: Hello

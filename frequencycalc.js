/**
 * Calculates the frequency of lowercase alphabetic characters (a-z)
 * in a given input string.
 *
 * @param {string} input - The string to analyze.
 * @returns {Object} An object where each key is a character and the value is its frequency.
 */
function calcFreq(input) {
  // Initialize an array of 26 zeroes to count letters 'a' to 'z'
  const freq = new Array(26).fill(0);

  // Iterate through each character in the input string
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i) - 97; // ASCII code of 'a' is 97
    if (charCode >= 0 && charCode < 26) {
      freq[charCode]++; // Increment count for this character
    }
  }

  // Build result object mapping letters to their frequencies
  const result = {};
  for (let i = 0; i < 26; i++) {
    if (freq[i] > 0) {
      const char = String.fromCharCode(i + 97); // Convert index back to character
      result[char] = freq[i];
    }
  }

  return result;
}

// Example usage
console.log(
  calcFreq("aajshfkjhwlsfuwenofsdksjdvbskdjvb-3r22vbcksjdgfkuwb")
);

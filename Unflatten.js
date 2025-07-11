/**
 * Converts a flattened object with dot-separated keys
 * into a nested object structure.
 *
 * @param {Object} obj - The flat object to unflatten.
 * @returns {Object} A nested object.
 */
function unflatten(obj) {
  const result = {};

  // Iterate through each key in the flattened object
  for (const key in obj) {
    const parts = key.split('.'); // Split the key into nested parts
    let current = result;

    // Traverse or create intermediate nested levels
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }

    // Assign the value to the deepest key
    current[parts[parts.length - 1]] = obj[key];
  }

  return result;
}

// Example usage
console.log(unflatten({ 'a.b': 1, 'a.c.d': 2 }));

/*
Expected Output:
{
  a: {
    b: 1,
    c: {
      d: 2
    }
  }
}
*/

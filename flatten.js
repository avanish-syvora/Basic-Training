/**
 * Flattens a nested object into a single-level object
 * with dot-separated keys representing the original hierarchy.
 *
 * @param {Object} obj - The nested object to flatten.
 * @returns {Object} A flat object.
 */
function flatten(obj) {
  const result = {};

  /**
   * Recursive helper function to build the flat object.
   *
   * @param {Object} current - Current nested object level.
   * @param {string} path - Accumulated key path (dot-separated).
   */
  function helper(current, path) {
    for (const key in current) {
      if (!Object.hasOwnProperty.call(current, key)) continue;

      const newPath = path ? `${path}.${key}` : key;

      // If the value is a non-null object (but not an array), recurse
      if (
        typeof current[key] === 'object' &&
        current[key] !== null &&
        !Array.isArray(current[key])
      ) {
        helper(current[key], newPath);
      } else {
        // Assign the value to the constructed path
        result[newPath] = current[key];
      }
    }
  }

  helper(obj, '');
  return result;
}

// ✅ Test Case
console.log(flatten({ a: { b: 1, c: { d: 2 } } }));

/*
Expected Output:
{
  "a.b": 1,
  "a.c.d": 2
}
*/

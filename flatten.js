function flatten(obj) {
  let result = {};

  function helper(curr, path) {
    for (let key in curr) {
      let newPath = path ? path + '.' + key : key;
      if (typeof curr[key] === 'object' && curr[key] !== null && !Array.isArray(curr[key])) {
        helper(curr[key], newPath);
      } else {
        result[newPath] = curr[key];
      }
    }
  }

  helper(obj, '');
  return result;
}


console.log(flatten({ a: { b: 1, c: { d: 2 } } }));
// Expected: { 'a.b': 1, 'a.c.d': 2 }
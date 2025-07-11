function unflatten(obj) {
  let result = {};

  for (let key in obj) {
    let parts = key.split('.');
    let curr = result;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!curr[parts[i]]) {
        curr[parts[i]] = {};
      }
      curr = curr[parts[i]];
    }

    curr[parts[parts.length - 1]] = obj[key];
  }

  return result;
}


console.log(unflatten({ 'a.b': 1, 'a.c.d': 2 }));
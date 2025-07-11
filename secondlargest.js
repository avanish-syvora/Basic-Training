function secondLargest(array) {
  let max = -Infinity;
  let second = -Infinity;

  for (let num of array) {
    if (num > max) {
      second = max;
      max = num;
    } else if (num > second && num < max) {
      second = num;
    }
  }

  return second === -Infinity ? null : second;
}

// Test Cases
console.log(secondLargest([1, 3, 4, 2, 5]));          // Expected: 4

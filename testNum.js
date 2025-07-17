// 1. testNum: Promise to test if a number is greater than or less than 10
function testNum(num) {
  return new Promise((resolve, reject) => {
    if (typeof num !== 'number') {
      reject("Error: Not a number");
    } else if (num > 10) {
      resolve("Number is greater than 10");
    } else {
      resolve("Number is less than or equal to 10");
    }
  });
}

// Test cases for testNum
testNum(15).then(console.log).catch(console.error); //  Number is greater than 10
testNum(8).then(console.log).catch(console.error);  // Numbe is less than or equal to 10
testNum("abc").then(console.log).catch(console.error); // Error: Nott a number

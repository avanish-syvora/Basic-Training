//Sequentially print 0 to 10 using Promises and random delay

function waitRandom() {
  const ms = Math.floor(Math.random() * 6000); // 0 to 6 sec
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function printSequentially(n = 0) {
  if (n > 10) return;
  await waitRandom();
  console.log(`Printed: ${n}`);
  printSequentially(n + 1);
}

// Test it
printSequentially(); // ➤ Will print 0 to 10 sequentially with random delays

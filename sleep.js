// sleep function: wait x seconds then run a callback (non-blocking)
function sleep(seconds, callback) {
  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve(); // ends promise after callback
    }, seconds * 1000);
  });
}

// Test sleep
sleep(2, () => console.log("2 seconds passed")).then(() => {
  console.log("Callback executed after sleep.");
});
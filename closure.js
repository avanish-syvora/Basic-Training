//  IIFE creates a closure with its own `iVal`
for (var i = 0; i < 10; i++) {
  (function(iVal) {
    setTimeout(function() {
      console.log("Using IIFE:", iVal); // Also 0 to 9
    }, 10);
  })(i);
}


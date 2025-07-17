/*The original recursive function was synchronous and deeply recursive, which causes a stack overflow when `somelist` is very large. This happens because each function call adds a frame to the call stack before the previous one completes.

I Used setTimeout(fun, 0) to defer each recursive call to the event loop, which clears the current call stack first — maintaining the recursive pattern but preventing stack overflow.
*/
// Simulating a very large list
var somelist = Array.from({ length: 10000 }, (_, i) => i);


// Fixed version using setTimeout to prevent stack overflow
var nextItem = function safeRecursion() {
  var item = somelist.pop();
  if (item !== undefined) {
    // Process the item
    console.log("Safe processing:", item);
    
    // Defer the next call to allow the call stack to clear
    setTimeout(safeRecursion, 0);
  }
};

// Call the safe version
nextItem();

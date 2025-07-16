// custom setTimeout using Date 
function customSetTimeout(callback, delay) {
  const start = Date.now();
  while (Date.now() - start < delay) {
    // Busy-wait loop
  }
  callback();
}

customSetTimeout(() => {
  console.log(" customSetTimeout callback executed");
}, 1000);

//  2. Custom Array Implementation
function MyArray() {
  this.data = {};
  this.length = 0;
}

MyArray.prototype.push = function (value) {
  this.data[this.length] = value;
  this.length++;
  return this.length;
};

MyArray.prototype.pop = function () {
  if (this.length === 0) return undefined;
  const last = this.data[this.length - 1];
  delete this.data[this.length - 1];
  this.length--;
  return last;
};

MyArray.prototype.shift = function () {
  if (this.length === 0) return undefined;
  const first = this.data[0];
  for (let i = 1; i < this.length; i++) {
    this.data[i - 1] = this.data[i];
  }
  delete this.data[this.length - 1];
  this.length--;
  return first;
};

MyArray.prototype.unshift = function (value) {
  for (let i = this.length - 1; i >= 0; i--) {
    this.data[i + 1] = this.data[i];
  }
  this.data[0] = value;
  this.length++;
  return this.length;
};

MyArray.prototype.indexOf = function (target) {
  for (let i = 0; i < this.length; i++) {
    if (this.data[i] === target) return i;
  }
  return -1;
};

MyArray.prototype.splice = function (start, deleteCount, ...items) {
  const removed = new MyArray();
  for (let i = 0; i < deleteCount; i++) {
    removed.push(this.data[start + i]);
  }

  const tail = [];
  for (let i = start + deleteCount; i < this.length; i++) {
    tail.push(this.data[i]);
  }

  this.length = start;
  items.forEach(item => this.push(item));
  tail.forEach(item => this.push(item));

  return removed;
};


MyArray.prototype.forEach = function (cb) {
  for (let i = 0; i < this.length; i++) {
    cb(this.data[i], i, this);
  }
};

//  Test MyArray
const arr = new MyArray();
arr.push("a");
arr.push("b");
arr.push("c");
arr.unshift("start");
console.log(" After unshift and push:", arr);

console.log(" Popped:", arr.pop());
console.log(" Shifted:", arr.shift());
console.log(" Index of 'b':", arr.indexOf("b"));

arr.forEach((val, idx) => {
  console.log(` ForEach ${idx}:`, val);
});

console.log(" Splice result:", arr.splice(0, 1));
console.log(" Final array:", arr);

//  Provided validateString function
function validateString(input, callback) {
  setTimeout(function () {
    if (typeof input === "string" && input === input.toLowerCase()) {
      return callback(null, true);
    }
    return callback(new Error('Invalid string'), null);
  }, 500);
}

//   validateAll using reduce (no loops/recursion)
function validateAll(inputs) {
  return new Promise((resolve) => {
    const result = {};
    inputs.reduce((chain, value) => {
      return chain.then(() =>
        new Promise((res) => {
          validateString(value, (err, isValid) => {
            result[String(value)] = isValid || false;
            res();
          });
        })
      );
    }, Promise.resolve()).then(() => resolve(result));
  });
}

//  Testing validateAll
const input = ['first', 'Second', 'thiRd', 4, false, 'true'];
validateAll(input).then((res) => {
  console.log(" Validation Result:", res);
});


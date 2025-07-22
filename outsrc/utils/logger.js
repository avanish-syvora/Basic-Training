"use strict";

var fs = require('fs');
var path = require('path');
var logFile = path.join(__dirname, "../log.txt");
function log(operation, a, b, result) {
  var line = "".concat(new Date().toISOString(), " | ").concat(operation, " ").concat(a, " ").concat(b, " = ").concat(result);
  fs.appendFileSync(logFile, line);
}
module.exports = log;
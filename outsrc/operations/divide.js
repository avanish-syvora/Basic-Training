"use strict";

module.exports = function (a, b) {
  if (b === 0) throw new Error("Cant divide by zero bidu");
  return a / b;
};
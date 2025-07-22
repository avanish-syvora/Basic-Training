"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var add = require("./operations/add");
var subtract = require("./operations/subtract");
var multiply = require("./operations/multiply");
var divide = require("./operations/divide");
var log = require("./utils/logger");
var args = process.argv.slice(2); // skip node & index.js
var _args = _slicedToArray(args, 3),
  operation = _args[0],
  a = _args[1],
  b = _args[2];
var x = Number(a);
var y = Number(b);
try {
  var result;
  switch (operation) {
    case "add":
      result = add(x, y);
      break;
    case "subtract":
      result = subtract(x, y);
      break;
    case "multiply":
      result = multiply(x, y);
      break;
    case "divide":
      result = divide(x, y);
      break;
    default:
      throw new Error("Invalid operation");
  }
  console.log("Result: ".concat(result));
  log(operation, x, y, result);
} catch (err) {
  console.error("Error:", err.message);
}
import { add, subtract, multiply, divide } from './operations/index.js';
import log from './utils/logger.js';
import { areValidOperands } from './utils/validator.js';

const args = process.argv.slice(2);
const [operation, aRaw, bRaw] = args;
const a = Number(aRaw);
const b = Number(bRaw);

try {
  if (!areValidOperands(a, b)) throw new Error('Invalid operands');

  let result;
  switch (operation) {
    case 'add': result = add(a, b); break;
    case 'subtract': result = subtract(a, b); break;
    case 'multiply': result = multiply(a, b); break;
    case 'divide': result = divide(a, b); break;
    default: throw new Error('Unsupported operation');
  }

  console.log(`Result: ${result}`);
  log(operation, a, b, result);
} catch (err) {
  console.error('Error:', err.message);
}

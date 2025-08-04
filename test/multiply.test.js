import multiply from '../operations/multiply.js';

describe('multiply', () => {

  // Test case 1: Multiplying two positive numbers
  test('should return the product of two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  // Test case 2: Multiplying a positive and a negative number
  test('should return a negative product when multiplying a positive and a negative number', () => {
    expect(multiply(5, -3)).toBe(-15);
  });

  // Test case 3: Multiplying two negative numbers
  test('should return a positive product when multiplying two negative numbers', () => {
    expect(multiply(-4, -5)).toBe(20);
  });

  // Test case 4: Multiplying by zero
  test('should return zero when multiplying any number by zero', () => {
    expect(multiply(100, 0)).toBe(0);
  });

  // Test case 5: Multiplying by one
  test('should return the number itself when multiplying by one', () => {
    expect(multiply(7, 1)).toBe(7);
  });
});

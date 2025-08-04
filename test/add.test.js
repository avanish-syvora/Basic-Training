import add from '../operations/add.js';
describe('add', () => {

  // Test case 1: Adding two positive numbers
  test('should return the sum of two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  // Test case 2: Adding a positive and a negative number
  test('should return the sum of a positive and a negative number', () => {
    expect(add(5, -2)).toBe(3);
  });

  // Test case 3: Adding two negative numbers
  test('should return the sum of two negative numbers', () => {
    expect(add(-5, -5)).toBe(-10);
  });

  // Test case 4: Adding zero to a number
  test('should return the number itself when adding zero', () => {
    expect(add(10, 0)).toBe(10);
  });

  // Test case 5: Adding two floating-point numbers
  test('should correctly add floating-point numbers', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});

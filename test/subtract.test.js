import subtract from '../operations/subtract.js';

// Test suite for the subtract function
describe('subtract', () => {

  // Test case 1: Subtracting a smaller number from a larger one
  test('should return the correct difference when subtracting a smaller number from a larger one', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  // Test case 2: Subtracting a larger number from a smaller one
  test('should return a negative number when subtracting a larger number from a smaller one', () => {
    expect(subtract(5, 10)).toBe(-5);
  });

  // Test case 3: Subtracting two negative numbers
  test('should correctly subtract two negative numbers', () => {
    // -5 - (-2) = -3
    expect(subtract(-5, -2)).toBe(-3);
  });

  // Test case 4: Subtracting zero from a number
  test('should return the number itself when subtracting zero', () => {
    expect(subtract(8, 0)).toBe(8);
  });

  // Test case 5: Subtracting a number from itself
  test('should return zero when subtracting a number from itself', () => {
    expect(subtract(12, 12)).toBe(0);
  });
});

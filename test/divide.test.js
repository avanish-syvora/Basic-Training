import divide from '../operations/divide.js';


describe('divide', () => {

  // Test case 1: Dividing two positive numbers
  test('should return the quotient of two positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  // Test case 2: Dividing a negative number by a positive number
  test('should return a negative quotient when dividing a negative by a positive', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  // Test case 3: Dividing by a negative number
  test('should return a negative quotient when dividing a positive by a negative', () => {
    expect(divide(10, -2)).toBe(-5);
  });

  // Test case 4: Dividing zero by a number
  test('should return 0 when dividing zero by any number', () => {
    expect(divide(0, 5)).toBe(0);
  });

  // Test case 5: Handling the "divide by zero" error
  test('should throw an error when dividing by zero', () => {
    // We wrap the function call in another function to test for thrown errors
    expect(() => {
      divide(10, 0);
    }).toThrow("Cant divide by zero bidu");
  });

  // Test case 6: Division resulting in a float
  test('should correctly handle division that results in a float', () => {
    expect(divide(5, 2)).toBe(2.5);
  });
});

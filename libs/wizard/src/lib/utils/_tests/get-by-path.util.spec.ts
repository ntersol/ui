import { getByPath } from '../get-by-path.util';
import { testObj } from './_base';

describe('Get object property by string path', () => {
  test('should get shallow property', () => {
    expect(getByPath('id', testObj)).toBe('12345');
  });

  test('should get deeply nested property', () => {
    expect(getByPath('app.total.amount', testObj)).toBe(10);
  });

  test('should be undefined if invalid path returned', () => {
    expect(getByPath('app.12345', testObj)).toBe(undefined);
  });

  test('should get array entry 1', () => {
    expect(getByPath('users.0.name', testObj)).toBe('John');
  });

  test('should get array entry 2', () => {
    expect(getByPath('users.1.name', testObj)).toBe('Jane');
  });

  test('should get deeply nested array property', () => {
    expect(getByPath('users.1.favFoods.1', testObj)).toBe('Chocolate');
  });
});

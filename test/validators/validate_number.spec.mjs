import assert from 'node:assert';
import { describe, it } from 'node:test';
import { validateNumber } from '../../src/validators/validate_number.mjs';

describe('Validators - Number', () => {
  it('should return INVALID_NUMBER_ERROR when a not number is passed', () => {
    const result = validateNumber('S');
    assert.deepStrictEqual(result, {
      value: ['INVALID_NUMBER_ERROR', 'Value is not a number!'],
      success: false,
    });
  });

  it('should accept custom error message', () => {
    const result = validateNumber(12);
    assert.deepStrictEqual(result, {
      success: true,
      value: 12,
    });
  });
});

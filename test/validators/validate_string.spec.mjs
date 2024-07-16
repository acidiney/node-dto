import assert from 'node:assert';
import { describe, it } from 'node:test';
import { validateString } from '../../src/validators/validate_string.mjs';

describe('Validators - String', () => {
  it('should return INVALID_STRING_ERROR when a string is not passed', () => {
    const result = validateString(true);
    assert.deepStrictEqual(result, {
      value: ['INVALID_STRING_ERROR', 'Value is not a string!'],
      success: false,
    });
  });

  it('should pass when a valid string is passed', () => {
    const result = validateString('abc');
    assert.deepStrictEqual(result, {
      success: true,
      value: 'abc',
    });
  });
});

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { validateArray } from '../../src/validators/validate_array.mjs';

describe('Validators - Array', () => {
  it('should return SCHEMA_NOT_AN_ARRAY_ERROR when array is not an array', () => {
    const result = validateArray(1);
    assert.deepStrictEqual(result, {
      value: ['SCHEMA_NOT_AN_ARRAY_ERROR', 'Schema need to be an array!'],
      success: false,
    });
  });

  it('should return SCHEMA_NOT_AN_ARRAY_ERROR when validatFn not returns true', () => {
    const result = validateArray([0, 1, 2], (v) => v > 0, 'GREATER_THAN_ZERO');
    assert.deepStrictEqual(result, {
      value: [
        'SCHEMA_FUNCTION_REJECTS_ERROR',
        'Schema function rejects GREATER_THAN_ZERO!',
      ],
      success: false,
    });
  });

  it('should pass when a valid array is passed', () => {
    const result = validateArray([0, 1, 2]);
    assert.deepStrictEqual(result, {
      success: true,
      value: [0, 1, 2],
    });
  });

  it('should pass when a valid array is passed and respects the validateFn', () => {
    const result = validateArray([0, 1, 2], (v) => v >= 0);
    assert.deepStrictEqual(result, {
      success: true,
      value: [0, 1, 2],
    });
  });
});

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { validateBoolean } from '../../src/validators/validate_boolean.mjs';

describe('Validators - Boolean', () => {
  it('should return INVALID_BOOLEAN_ERROR when a not boolean is passed', () => {
    const result = validateBoolean(1);
    assert.deepStrictEqual(result, {
      value: ['INVALID_BOOLEAN_ERROR', 'Value is not a boolean!'],
      success: false,
    });
  });

  it('should pass when a valid boolean is passed', () => {
    const result = validateBoolean(true);
    assert.deepStrictEqual(result, {
      success: true,
      value: true,
    });
    const resultFalse = validateBoolean(false);
    assert.deepStrictEqual(resultFalse, {
      success: true,
      value: false,
    });
  });
});

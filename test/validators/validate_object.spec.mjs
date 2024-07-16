import assert from 'node:assert';
import { describe, it } from 'node:test';
import { validateObject } from '../../src/validators/validate_object.mjs';

describe('Validators - Object', () => {
  it('should return INVALID_OBJECT_ERROR when a not object is passed', () => {
    const result = validateObject('S');
    assert.deepStrictEqual(result, {
      value: ['INVALID_OBJECT_ERROR', 'Value is not an object!'],
      success: false,
    });
  });

  it('should return INVALID_OBJECT_ERROR when a null is passed', () => {
    const result = validateObject(null);
    assert.deepStrictEqual(result, {
      value: ['INVALID_OBJECT_ERROR', 'Value is not an object!'],
      success: false,
    });
  });

  it('should pass when a valid object is passed', () => {
    const result = validateObject({});
    assert.deepStrictEqual(result, {
      success: true,
      value: {},
    });
  });
});

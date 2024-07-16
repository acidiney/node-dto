import assert from 'node:assert';
import { describe, it } from 'node:test';
import { validateEnum } from '../../src/validators/validate_enum.mjs';

describe('Validators - Enum', () => {
  it('should return INVALID_ENUM_OPT_ERROR when a not date is passed', () => {
    const result = validateEnum('S', ['Y', 'N']);
    assert.deepStrictEqual(result, {
      value: ['INVALID_ENUM_OPT_ERROR', "Value S don't exists on enum Y,N!"],
      success: false,
    });
  });

  it('should pass when a valid date is passed', () => {
    const result = validateEnum('Y', ['Y', 'N']);
    assert.deepStrictEqual(result, {
      success: true,
      value: 'Y',
    });
  });

  it('should accept custom error message', () => {
    const result = validateEnum('S', ['Y', 'N'], 'CUSTOM_ERROR');
    assert.deepStrictEqual(result, {
      success: false,
      value: ['INVALID_ENUM_OPT_ERROR', 'CUSTOM_ERROR'],
    });
  });
});

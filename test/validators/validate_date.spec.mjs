import assert from 'node:assert';
import { describe, it } from 'node:test';
import { validateDate } from '../../src/validators/validate_date.mjs';

describe('Validators - Date', () => {
  it('should return INVALID_DATE_ERROR when a not date is passed', () => {
    const result = validateDate(1);
    assert.deepStrictEqual(result, {
      value: ['INVALID_DATE_ERROR', 'Value is not a date!'],
      success: false,
    });
  });

  it('should pass when a valid date is passed', () => {
    const mockDate = new Date();
    const result = validateDate(mockDate);
    assert.deepStrictEqual(result, {
      value: mockDate,
      success: true,
    });
  });
});

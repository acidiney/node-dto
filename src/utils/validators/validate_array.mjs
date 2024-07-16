'use strict';

/**
 * Validates an array.
 *
 * @param {Array} array
 * @param {function=} validateFn
 * @param {string=} validateKey
 * @returns {{success: boolean, value: string|Array}}
 */
export function validateArray(array, validateFn = null, validateKey = null) {
  if (!(array instanceof Array))
    return {
      value: ['SCHEMA_NOT_AN_ARRAY_ERROR', 'Schema need to be an array!'],
      success: false,
    };

  if (validateFn) {
    if (!array.every((p) => validateFn(p))) {
      return {
        value: [
          'SCHEMA_NOT_AN_ARRAY_ERROR',
          `Schema need to be an array of ${validateKey}!`,
        ],
        success: false,
      };
    }
  }

  return {
    success: true,
    value: array,
  };
}

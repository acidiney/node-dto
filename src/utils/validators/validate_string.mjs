'use strict';

/**
 *
 * @type {{validateString: (function(*=): boolean)}}
 */
export function validateString(value) {
  const isString = typeof value === 'string';
  return {
    success: isString,
    value: isString
      ? value
      : ['INVALID_STRING_ERROR', 'Value is not a string!'],
  };
}

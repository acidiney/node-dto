'use strict';

/**
 *
 * @type {{validateBoolean: (function(*=): boolean)}}
 */
export function validateBoolean(value) {
  const isBoolean = typeof value === 'boolean';

  return {
    success: isBoolean,
    value: isBoolean
      ? value
      : ['INVALID_BOOLEAN_ERROR', 'Value is not a boolean!'],
  };
}

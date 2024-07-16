'use strict';

/**
 *
 * @type {{validateNumber: ((function(*=): (boolean|number))|*)}}
 */
export function validateNumber(value) {
  const parsed = Number(value);

  if (isNaN(parsed))
    return {
      success: false,
      value: ['INVALID_NUMBER_ERROR', 'Value is not a number!'],
    };

  return {
    success: true,
    value: parsed,
  };
}

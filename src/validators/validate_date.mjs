'use strict';

/**
 *
 * @type {{validateDate: (function(*): boolean)}}
 */
export function validateDate(value) {
  const isDate = value instanceof Date;

  return {
    success: isDate,
    value: isDate ? value : ['INVALID_DATE_ERROR', 'Value is not a date!'],
  };
}

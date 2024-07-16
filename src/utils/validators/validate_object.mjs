'use strict';

/**
 *
 * @type {{validateObject: (function(*): boolean)}}
 */
export function validateObject(obj) {
  const isObject =
    typeof obj === 'object' && !Array.isArray(obj) && obj !== null;

  return {
    success: isObject,
    value: isObject ? obj : ['INVALID_OBJECT_ERROR', 'Value is not an object!'],
  };
}

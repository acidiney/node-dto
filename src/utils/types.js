'use strict';
const {
    validateString,
    validateNumber,
    validateBoolean,
    validateDate,
    validateObject,
    validateEnum,
} = require('./validators/index');

module.exports = {
  String: (value) => validateString(value),
  Number: (value) => validateNumber(value),
  Date: (value) => validateDate(value),
  Boolean: (value) => validateBoolean(value),
  Object: (value) => validateObject(value),
  Enum: (value, options) => validateEnum(value, options),
};

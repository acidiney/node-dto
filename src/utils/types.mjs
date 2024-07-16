'use strict';
import {
  validateString,
  validateNumber,
  validateBoolean,
  validateDate,
  validateObject,
  validateEnum,
  validateArray,
} from './validators/index.mjs';

export default {
  String: validateString,
  Number: validateNumber,
  Date: validateDate,
  Boolean: validateBoolean,
  Object: validateObject,
  Enum: validateEnum,
  Array: validateArray,
};

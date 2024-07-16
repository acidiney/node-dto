'use strict';
import {
  validateString,
  validateNumber,
  validateBoolean,
  validateDate,
  validateObject,
  validateEnum,
  validateArray,
} from '../utils/validators/index.mjs';
import { TYPES, validateType } from './types.mjs';
import { validateSchema } from './validators/schema_validator.mjs';

export const specialTypes = [TYPES.ENUM, TYPES.ARRAY, TYPES.OBJECT];

const specialTypeRequiredProps = {
  [TYPES.ENUM]: 'enumOps',
  [TYPES.OBJECT]: 'schema',
  [TYPES.ARRAY]: 'itemsType',
};

export const validateSpecial = (row) => {
  if (!specialTypes.includes(row.type)) {
    return {
      success: true,
      value: null,
    };
  }

  const specialTypeProp = specialTypeRequiredProps[row.type];

  if ([null, undefined].includes(row[specialTypeProp])) {
    return {
      success: false,
      value: [
        'RECOGNIZED_SPECIAL_TYPE_NOT_DEFINED_ERROR',
        `Prop '${specialTypeProp}' is required when you choose type '${row.type}'!`,
      ],
    };
  }

  if (row.type === TYPES.OBJECT) {
    return validateSchema(row.schema);
  }

  if (row.type === TYPES.ARRAY) {
    if (row.itemsType === TYPES.ARRAY)
      return {
        success: false,
        value: [
          'CANNOT_USE_ARRAY_AS_ITEMS_TYPE_ERROR',
          "Can't cambine type Array with itemsType Array!",
        ],
      };

    let validation = validateType(row.itemsType);

    if (!validation.success) {
      return {
        success: false,
        value: [
          'RECOGNIZED_TYPE_NOT_DEFINED_ERROR',
          `Type ${row.itemsType} was not recognized!`,
        ],
      };
    }

    return validateSpecial({
      ...row,
      type: row.itemsType,
    });
  }

  if (row.type === TYPES.ENUM) {
    const output = validateArray(row.enumOps);

    if (!output.success) {
      return {
        success: false,
        value: output.value,
      };
    }

    if (row.enumOps.length === 0) {
      return {
        success: false,
        value: ['ENUM_EMPTY_ERROR', 'Enum is empty!'],
      };
    }

    return {
      success: true,
      value: null,
    };
  }
};

export const HANDLERS = {
  [TYPES.STRING]: validateString,
  [TYPES.NUMBER]: validateNumber,
  [TYPES.DATE]: validateDate,
  [TYPES.BOOLEAN]: validateBoolean,
  [TYPES.OBJECT]: validateObject,
  [TYPES.ENUM]: validateEnum,
  [TYPES.ARRAY]: validateArray,
};

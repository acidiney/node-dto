'use strict';

import schemaProps from '../utils/props_schema.mjs';
import { validateArray } from './validate_array.mjs';
import { TYPES, validateType } from '../types.mjs';
import { HANDLERS, specialTypes, validateSpecial } from '../types_handlers.mjs';

Array.prototype.diff = function (arr2) {
  return this.filter((x) => !arr2.includes(x));
};

/**
 * @param {Schema} schema - Definition of the schema.
 */
export const validateSchema = (schema) => {
  if (!schema) {
    return {
      success: false,
      value: ['SCHEMA_NOT_DEFINED_ERROR', 'Schema is not defined!'],
    };
  }

  let validation = validateArray(schema);

  if (!validation.success) {
    return {
      success: false,
      value: ['SCHEMA_NOT_AN_ARRAY_ERROR', validation.value[1]],
    };
  }

  if (!schema.length) {
    return {
      success: false,
      value: ['SCHEMA_EMPTY_ERROR', 'Schema is empty!'],
    };
  }

  for (const row of schema) {
    const keys = Object.keys(row);

    /**
     * Validate required props
     */
    const missingProps = Array(...schemaProps).diff(keys);
    if (missingProps.length > 0) {
      return {
        success: false,
        value: [
          'SCHEMA_MALFORMED_ERROR',
          missingProps.map(
            (key) =>
              `Prop '${key}' is required when you choose type '${row.type}'!`
          ),
        ],
      };
    }

    /**
     * Validate type
     */
    validation = validateType(row.type);

    if (!validation.success) {
      return {
        success: false,
        value: validation.value,
      };
    }

    /**
     * Validate type of defaultValue
     */
    if (row.defaultValue) {
      const isEnum = row.type === TYPES.ENUM;

      validation = isEnum
        ? HANDLERS[row.type](row.defaultValue, row.enumOps)
        : HANDLERS[row.type](row.defaultValue);

      if (!validation.success) {
        return {
          success: false,
          value: [
            'INVALID_DEFAULT_TYPE_VALUE_ERROR',
            `Value of the Field defaultValue is not of the type '${row.type}'!`,
          ],
        };
      }
    }

    /**
     * Validate Special types
     */
    if (!specialTypes.includes(row.type)) {
      return {
        success: true,
        value: null,
      };
    }

    return validateSpecial(row);
  }
};

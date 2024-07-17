'use strict';

import schemaProps from '../utils/props_schema.mjs';
import { validateArray } from './validate_array.mjs';
import { TYPES, validateType } from '../types.mjs';
import { HANDLERS, specialTypes, validateSpecial } from '../types_handlers.mjs';

Array.prototype.diff = function (arr2) {
  return this.filter((x) => !arr2.includes(x));
};


/**
 * Represents a schema for defining properties.
 * @typedef {Array<Property>} Schema
 */

/**
 * Represents all supported types.
 * @typedef {(Number|string|Date|boolean|Enum|Object|Array)} Type
 */

/**
 * Represents a property object in the schema.
 * @typedef {Object} Property
 * @property {string} name - Name of the property.
 * @property {Type} type - Type of the property.
 * @property {boolean} required - Whether the property is required.
 * @property {string} serialize - Serialization function for the property.
 * @property {Array} [enumOps] - Required if type is Enum. Array of options for Enum type.
 * @property {Schema} [schema] - Required if type is Object. Schema definition for the Object type.
 * @property {Type} [itemsType] - Required if type is Array. Type of items in the array.
 */

/**
 * Represents an Enum type.
 * @typedef {string[]} Enum
 */

/**
 * Function that uses a schema definition.
 * @param {Schema} params - Definition of the schema.
 * @returns {NodeDto}
 */

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

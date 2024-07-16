'use strict';

import { TYPES } from './types.mjs';
import { HANDLERS, specialTypes } from './types_handlers.mjs';
import { validateSchema } from './validators/schema_validator.mjs';

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

export class NodeDto {
  /**
   * @type {Schema}
   */
  #schema;

  /**
   * Function that uses a schema definition.
   * @param {Schema} schema - Definition of the schema.
   */
  constructor(schema) {
    this.#schema = schema;
    this.#useSchema();
  }

  #useSchema() {
    const validation = validateSchema(this.#schema);

    if (!validation.success) {
      throw new Error(validation.value[0]);
    }
  }

  #validateRow(prop, value) {
    const valueNotDefined = value === null || value === undefined;
    // Ignore type checking if doesn't have value and not required
    if (!prop.required && valueNotDefined)
      return {
        success: true,
        value: prop.defaultValue || prop.type === TYPES.BOOLEAN ? false : null,
      };

    if (prop.required && valueNotDefined) {
      return {
        success: false,
        value: ['REQUIRED_PROP_CANNOT_BE_NULLABLE', 'Prop is required!'],
      };
    }

    if (!specialTypes.includes(prop.type)) {
      return HANDLERS[prop.type](value);
    }

    const strategy = {
      [specialTypes.Enum]: (value, prop) => {
        const { enumOps } = prop;

        return HANDLERS[prop.type](value, enumOps);
      },
      [specialTypes.Object]: (value, prop) => {
        const { schema } = prop;
        return this.#validate(value, schema);
      },
      [specialTypes.Array]: (value, prop) => {
        let fn = strategy[prop.itemsType];

        if (!fn) {
          fn = HANDLERS[prop.itemsType];
        }

        const result = validateArray(
          value,
          (d) => fn(d, { ...prop, type: entry.itemsType }),
          prop.itemsType
        );

        let resultSerialized = [];

        if ([TYPES.OBJECT].includes(prop.itemsType)) {
          for (const row of result) {
            resultSerialized.push({});
            for (const item of prop.schema) {
              resultSerialized[resultSerialized.length - 1][item.serialize] =
                row[item.name];
            }
          }
        }

        return (resultSerialized.length && resultSerialized) || result;
      },
    };

    if (!strategy[prop.type]) {
      return {
        success: false,
        value: [
          'INVALID_TYPE',
          `Field ${prop.name} with value ${value} is not typeof ${prop.type}!`,
        ],
      };
    }

    return strategy[prop.type](value, prop);
  }

  #validate(input) {
    const serialized = {};
    const requiredProps = this.#schema
      .filter((d) => d.required)
      .map((d) => ({ name: d.name, serialize: d.serialize }));

    for (const prop of requiredProps) {
      if (!input.hasOwnProperty(prop.name)) {
        serialized[prop.serialize] = {
          success: false,
          value: ['FIELD_NOT_DEFINED', `Field ${prop.name} is required!`],
        };
      }
    }

    for (const prop of this.#schema) {
      if (input.hasOwnProperty(prop.name)) {
        serialized[prop.serialize] = this.#validateRow(prop, input[prop.name]);

        if (prop.defaultValue && serialized[prop.serialize] === null)
          serialized[prop.serialize] = prop.defaultValue;
      }
    }

    return serialized;
  }

  #clean(input) {
    const serialized = {};
    for (const prop of Object.keys(input)) {
      if (input[prop].success) {
        serialized[prop] = input[prop].value;
      }
    }
    return serialized;
  }

  /**
   * @param {Object} input
   * @returns {Object}
   */
  validate(input) {
    const isArray = input instanceof Array;
    if (!isArray) {
      input = [input];
    }

    const result = input.map((row) => {
      const output = this.#validate(row);
      const keys = Object.keys(output);
      for (const key of keys) {
        if (!output[key].success) {
          throw new Error(output[key].value[0]);
        }
      }

      return this.#clean(output);
    });

    return isArray ? result : result[0];
  }

  validateAsync(input) {
    const isArray = input instanceof Array;
    if (!isArray) {
      input = [input];
    }

    const result = input.map((row) => this.#validate(row));
    const withErrors = [];

    for (const row of result) {
      const keys = Object.keys(row);
      for (const key of keys) {
        if (!row[key].success) {
          withErrors.push({ [key]: row[key].value[0] });
        }
      }
    }

    if (withErrors.length) {
      return { success: false, errors: withErrors };
    }

    return isArray ? result : result[0];
  }

  entries() { }
}

'use strict';

const schema = require('./utils/propsSchema')
const AvailableTypes = require('./utils/types');
const ValidateException = require('./exceptions/ValidateException');
const { validateEnum, validateArray} = require('./utils/validators')

function validateSchema(params) {
  validateArray(params)
  validateArray(params, AvailableTypes.Object, 'Object');

  for (let i = 0; i < params.length; i++) {

    const row = params[i]
    const keys = Object.keys(row);

    for (const key of schema) {
      validateEnum(key, keys, `Prop ${key} is missing on schema index ${i}!`)
    }
  }

  const availableTypes = Object.keys(AvailableTypes);
  const types = params.map((dt) => dt.type);

  types.forEach((type) => {
    if (!availableTypes.includes(type)) {
      throw new ValidateException(`${type} was not recognized!`);
    }
  });
}
/**
 *
 * @param entry
 * @param data
 * @returns {null|boolean|*}
 */
function validateLine(entry, data) {
  if (entry.required && !data)
      throw new ValidateException(
          `Field ${entry.name} is required!`
      );

  if (data && !AvailableTypes[entry.type](data))
    throw new ValidateException(
        `Field ${entry.name} with value ${data}, is not typeof ${entry.type}!`
    );

  if (!entry.required && !data) return null;

  const result = AvailableTypes[entry.type](data);

  return typeof result !== 'boolean' ? result : data
}

module.exports = {
  /**
   *
   * @Author Acidiney Dias <acidineydias@gmail.com>
   *
   * @param {Object[]} params
   * @param {String} params.name
   * @param {AvailableTypes} params.type
   * @param {String} params.serialize
   * @param {Boolean} params.required
   * @returns {{exportUsingSQL: (function(*=): *[]),entries: (function(): *[]), export: ((function((Object|Object[])): ({}|{}[]))|*), validate: (function(Object): {})}}
   * @constructor
   */
  MakeDto: (params) => {
    validateSchema(params);
    const dto = params;

    return {
      /**
       * @param {Object} input
       * @returns {Object}
       */
      validate: (input) => {
        const keys = Object.keys(input);
        const validated = {};

        for (const entry of dto) {
          for (const key of keys) {
            if (entry.name === key) {
              validated[entry.serialize] = validateLine(entry, input[key]);
            }
          }
        }

        return validated;
      },

      /**
       * @returns {String[]}
       */
      entries: () => dto.map((dt) => dt.name),

      /**
       *
       * @param {object|object[]} data
       * @returns {{}|{}[]}
       */
      export: (data) => {
        const convert = (entry) => {
          const keys = Object.keys(entry);
          const serialize = {};

          for (const key of keys) {
            const founded = dto.find((dt) => dt.serialize === key);
            serialize[founded.name] = entry[key];
          }

          return serialize;
        };

        if (data instanceof Array) {
          return data.map(convert);
        }

        return convert(data);
      },

      /**
       *
       * @param entity
       * @returns {*[]}
       */
      exportUsingSQL: (entity = null) => {
        const sql = [];

        for (const dt of dto) {
          sql.push(
            `${
              entity
                ? `${entity}.${dt.serialize} as ${dt.name}`
                : `${dt.serialize} as ${dt.name}`
            }`
          );
        }

        return sql;
      },
    };
  },
};

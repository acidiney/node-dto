'use strict';

const AvailableTypes = require('./utils/types');
const ValidateException = require('./exceptions/ValidateException');

function validateSchema(params) {
  if (!(params instanceof Array))
    throw new ValidateException('Schema need to be an array');

  if (!params.every((p) => p instanceof Object))
    throw new ValidateException('Schema need to be an array of objects');

  for (let i = 0; i < params.length; i++) {

    const row = params[i]
    const keys = Object.keys(row);

    for (const key of ['name', 'serialize', 'required', 'type']) {
      if (!keys.includes(key))
        throw new ValidateException(`Prop ${key} is missing on schema index ${i}!`);
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
  if (entry.required) {
    if (AvailableTypes[entry.type](data) && typeof data !== 'undefined') {
      return data;
    }

    return false;
  }

  if (typeof data === 'undefined') return null;

  if (AvailableTypes[entry.type](data)) {
    return data;
  }

  return false;
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
              const response = validateLine(entry, input[key]);

              if (typeof response === 'boolean')
                throw new ValidateException(
                  `Field ${entry.name} with value ${input[key]}, is not typeof ${entry.type}!`
                );

              validated[entry.serialize] = response;
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

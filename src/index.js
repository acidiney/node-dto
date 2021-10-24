'use strict';

const schema = require('./utils/propsSchema');
const AvailableTypes = require('./utils/types');
const ValidateException = require('./exceptions/ValidateException');
const {
  validateSchema,
  validateArray,
  validateEnum,
  exceptionTypes,
} = require('./utils/validators');

/**
 *
 * @param entry
 * @param data
 * @param index
 * @returns {null|boolean|*}
 */
function validateLine(entry, data, index = null) {
  if (entry.required && !data)
    throw new ValidateException(
      `Field ${entry.name} is required${index ? ` - on index #${index}` : ''}!`
    );

  // Ignore type checking if doesn't have data and not required
  if (!entry.required && !data) return null;

  // Checking type
  let result = null;

  if (entry.type === exceptionTypes.Enum) {
    const { enumOps } = entry;
    result = AvailableTypes[entry.type](data, enumOps);
  }

  if (entry.type === exceptionTypes.Object) {
    const { schema } = entry;
    result = _validate(data, schema);
  }

  if (!Object.keys(exceptionTypes).includes(entry.type)) {
    result = AvailableTypes[entry.type](data);
  }

  if (data && !result)
    throw new ValidateException(
      `Field ${entry.name} with value ${data}, is not typeof ${entry.type}${
        typeof index !== 'undefined' ? ` - on index #${index}` : ''
      }!`
    );

  if (!entry.required && !data) return null;

  return typeof result !== 'boolean' ? result : data;
}

function _validate(input, dto, index = null) {
  const keys = Object.keys(input);
  const validated = {};

  const requiredProps = dto.filter((d) => d.required).map((d) => d.name);

  requiredProps.forEach((prop) => {
    if (!keys.includes(prop)) {
      throw new ValidateException(
        `Field ${prop} is required${
          typeof index !== 'undefined' ? ` - on index #${index}` : ''
        }!`
      );
    }
  });

  for (const entry of dto) {
    for (const key of keys) {
      if (entry.name === key) {
        validated[entry.serialize] = validateLine(entry, input[key], index);
        if(entry.defaultValue && validated[entry.serialize]===null)
          validated[entry.serialize]=entry.defaultValue;
      }
    }
  }

  return validated;
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
    validateSchema(params, validateArray, validateEnum, schema, AvailableTypes);
    const dto = params;

    return {
      /**
       * @param {Object|Object[]} input
       * @returns {Object|Object[]}
       */
      validate: (input) => {
        let result;

        if (!input.length) {
          result = _validate(input, dto);
        }

        if (input instanceof Array) {
          result = input.map((row, idx) => _validate(row, dto, idx));
        }

        return result;
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

'use strict';

const schema = require('./utils/propsSchema');
const AvailableTypes = require('./utils/types');
const ValidateException = require('./exceptions/ValidateException');
const { validateEnum, validateArray } = require('./utils/validators');

function validateSchema(params) {
  validateArray(params);
  validateArray(params, AvailableTypes.Object, 'Object');
  for (let i = 0; i < params.length; i++) {
    const row = params[i];
    console.log(row)
    const keys = Object.keys(row);
      if((typeof row['defaultValue']).toLowerCase()!==row['type'].toLowerCase()){
        throw new ValidateException(
        `Value of the Field defaultValue is not of the same type 
          as the value given in field type on schema index ${i}!`
        );
      } 

    for (const key of schema) {
      validateEnum(key, keys, `Prop ${key} is missing on schema index ${i} !`);
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
 * @param index
 * @returns {null|boolean|*}
 */
function validateLine(entry, data, index = null) {
  if (entry.required && !data)
    throw new ValidateException(
      `Field ${entry.name} is required${index ? ` - on index #${index}` : ''}!`
    );
  if (data && !AvailableTypes[entry.type](data))
    throw new ValidateException(
      `Field ${entry.name} with value ${data}, is not typeof ${entry.type}${
        typeof index !== 'undefined' ? ` - on index #${index}` : ''
      }!`
    );

  if (!entry.required && !data) return null;

  const result = AvailableTypes[entry.type](data);

  return typeof result !== 'boolean' ? result : data;
}

function _validate(input, dto, index = null) {
  const keys = Object.keys(input);
  const validated = {};
  const requiredProps = dto.filter((d) => d.required).map((d) => d.name);
  requiredProps.forEach((prop) => {
    if(!keys.includes(prop)) {
      throw new ValidateException(
        `Field ${prop} is required${
          typeof index !== 'undefined' ? ` - on index #${index}` : ''
        }!`
      );
    }
  }
  );
  
  for (const entry of dto) {
    for (const key of keys) {
      if (entry.name === key) {
        if(!input[key]){input[key]=entry.defaultValue}
        validated[entry.serialize] = validateLine(entry, input[key], index);
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
    validateSchema(params);
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

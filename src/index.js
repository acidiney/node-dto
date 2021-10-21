'use strict';

const AvailableTypes = require('./utils/types');
const ValidateException = require('./exceptions/ValidateException');

/**
 *
 * @param entry
 * @param data
 * @returns {null|boolean|*}
 */
function validateLine(entry, data) {
    if (entry.required) {
        if (AvailableTypes[entry.type](data) && typeof data !== 'undefined') {
            return data
        }

        return true
    }

    if (typeof data === 'undefined')
        return null

    if (AvailableTypes[entry.type](data)) {
        return data
    }

    return true;
}

/**
 *
 * @Author Acidiney Dias <acidineydias@gmail.com>
 *
 * @param {Object[]} params
 * @param {String} params.name
 * @param {AvailableTypes} params.type
 * @param {String} params.serialize
 * @param {Boolean} params.required
 * @returns {{validate: (function(Object): *)}}
 */
module.exports = {
    MakeDto: (params) => {
        const availableTypes = Object.keys(AvailableTypes);

        const dto = params;

        (() => {
            const types = dto.map((dt) => dt.type);

            types.forEach((type) => {
                if (!availableTypes.includes(type)) {
                    throw new ValidateException(`${type} not recognized!`)
                }
            })
        })()


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

                            const response = validateLine(entry, input[key])

                            if (typeof response === 'boolean')
                                throw new ValidateException(`Field ${entry.name} with value ${input[key]}, is not valid!`)

                            validated[entry.serialize] = response
                        }
                    }
                }

                return validated
            },

            /**
             * @returns {String[]}
             */
            entries: () => dto.map(dt => dt.name),

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
                        const founded = dto.find((dt) => dt.serialize === key)
                        serialize[founded.name] = entry[key]
                    }

                    return serialize;
                }

                if (data instanceof Array) {
                    return data.map(convert)
                }

                return convert(data)
            },

            /**
             *
             * @param entity
             * @returns {*[]}
             */
            exportUsingSQL: (entity = null) => {
                const sql = [];

                for (const dt of dto) {
                    sql.push(`${entity ? `${entity}.${dt.serialize} as ${dt.name}` : `${dt.serialize} as ${dt.name}`}`)
                }

                return sql;
            }
        }
    }
}
